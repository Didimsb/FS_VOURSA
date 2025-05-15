import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  Icon,
  VStack,
  useColorModeValue,
  Image,
  Stack,
  Button,
  Flex,
  HStack,
  Avatar,
  Badge,
  Divider,
  Grid,
  GridItem,
  useBreakpointValue,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  IconButton,
  Tooltip,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from '@chakra-ui/react';
import { motion, useScroll, useTransform, useSpring, useAnimation } from 'framer-motion';
import { 
  Building2, 
  Users, 
  Target, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Star, 
  ChevronRight,
  ChevronLeft,
  Quote,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
  CheckCircle,
  Heart,
  Home,
  DollarSign,
  Shield,
  Clock,
  TrendingUp,
  UserPlus,
  Building,
  LandPlot,
  HomeIcon,
  Briefcase,
  Map,
  ChevronDown,
  ChevronUp,
  MessageCircle,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionImage = motion(Image);

const AboutUs = () => {
  const { settings, loading } = useSettings();
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('yellow.500', 'yellow.300');
  const lightBg = useColorModeValue('gray.50', 'gray.900');
  const darkBg = useColorModeValue('gray.100', 'gray.700');
  const cardBg = useColorModeValue('white', 'gray.800');
  const headingColor = useColorModeValue('gray.800', 'white');
  const tabBg = useColorModeValue('white', 'gray.800');
  const tabBorderColor = useColorModeValue('gray.200', 'gray.700');
  const testimonialBg = useColorModeValue('white', 'gray.800');
  const formBg = useColorModeValue('white', 'gray.800');
  const inputBg = useColorModeValue('white', 'gray.700');
  const inputBorderColor = useColorModeValue('gray.300', 'gray.600');
  const inputTextColor = useColorModeValue('gray.800', 'white');
  const placeholderColor = useColorModeValue('gray.400', 'gray.500');
  
  const [activeTab, setActiveTab] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredValue, setHoveredValue] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);
  const [hoveredTeam, setHoveredTeam] = useState(null);
  const [isBadgeHovered, setIsBadgeHovered] = useState(false);
  
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 1, 0]);
  
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const badgeControls = useAnimation();
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 100);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    if (isBadgeHovered) {
      badgeControls.start({
        scale: [1, 1.1, 1],
        boxShadow: [
          "0 0 0 rgba(66, 153, 225, 0.6)",
          "0 0 20px rgba(66, 153, 225, 0.8)",
          "0 0 0 rgba(66, 153, 225, 0.6)"
        ],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: "loop"
        }
      });
    } else {
      badgeControls.start({
        scale: 1,
        boxShadow: "0 0 0 rgba(66, 153, 225, 0.6)",
        transition: { duration: 0.3 }
      });
    }
  }, [isBadgeHovered, badgeControls]);
  
  const testimonials = [
    {
      name: 'أحمد محمد',
      role: 'مستثمر عقاري',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      text: 'خدمة ممتازة وفريق عمل محترف. ساعدوني في العثور على أفضل استثمار عقاري في المنطقة.',
      rating: 5,
    },
    {
      name: 'فاطمة أحمد',
      role: 'مالكة منزل',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      text: 'تجربة رائعة مع وكالة ورسة. بيعت منزلي بسرعة وبسعر ممتاز. أنصح الجميع بالتعامل معهم.',
      rating: 5,
    },
    {
      name: 'عبد الله سعيد',
      role: 'مطور عقاري',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      text: 'شراكة استراتيجية ممتازة. ورسة هي شريكنا الموثوق به في جميع مشاريعنا العقارية.',
      rating: 4,
    },
  ];
  
  const teamMembers = [
    {
      name: 'محمد عبد الله',
      role: 'المدير التنفيذي',
      image: 'https://randomuser.me/api/portraits/men/32.jpg',
      bio: 'خبرة 15 عاماً في مجال العقارات والاستثمار',
      social: {
        instagram: '#',
        facebook: '#',
        twitter: '#',
        linkedin: '#',
      },
    },
    {
      name: 'فاطمة الزهراء',
      role: 'مديرة التسويق',
      image: 'https://randomuser.me/api/portraits/women/44.jpg',
      bio: 'خبرة 10 أعوام في التسويق العقاري',
      social: {
        instagram: '#',
        facebook: '#',
        twitter: '#',
        linkedin: '#',
      },
    },
    {
      name: 'عبد الرحمن سعيد',
      role: 'مدير المبيعات',
      image: 'https://randomuser.me/api/portraits/men/67.jpg',
      bio: 'خبرة 12 عاماً في مبيعات العقارات الفاخرة',
      social: {
        instagram: '#',
        facebook: '#',
        twitter: '#',
        linkedin: '#',
      },
    },
    {
      name: 'أسماء محمد',
      role: 'مستشارة عقارية',
      image: 'https://randomuser.me/api/portraits/women/68.jpg',
      bio: 'خبرة 8 أعوام في الاستشارات العقارية',
      social: {
        instagram: '#',
        facebook: '#',
        twitter: '#',
        linkedin: '#',
      },
    },
  ];
  
  const stats = [
    { label: 'عقار تم بيعه', value: '500+', icon: Home },
    { label: 'عميل راضٍ', value: '1000+', icon: UserPlus },
    { label: 'سنوات خبرة', value: '10+', icon: Calendar },
    { label: 'مكتب', value: '3', icon: Building },
  ];
  
  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };
  
  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };
  
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Icon
        key={i}
        as={Star}
        color={i < rating ? 'yellow.400' : 'gray.300'}
        w={5}
        h={5}
      />
    ));
  };

  return (
    <Box bg={bgColor}>
      {/* Banner Section */}
      <Box
        position="relative"
        h={{ base: '40vh', md: '50vh' }}
        bgImage={`url('${settings?.banners?.about?.image || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'}')`}
        bgSize="cover"
        bgPosition="center"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'black',
          opacity: 0.5,
        }}
      >
        <Container maxW="container.xl" position="relative" zIndex={1} h="full">
          <Flex direction="column" justify="center" align="center" h="full" textAlign="center" color="white">
            <Heading
              as="h1"
              size="2xl"
              mb={4}
              textShadow="2px 2px 4px rgba(0,0,0,0.5)"
            >
              {settings?.banners?.about?.title || 'عن وكالة ورسة'}
            </Heading>
            <Text fontSize="xl" maxW="3xl" mx="auto" textShadow="1px 1px 2px rgba(0,0,0,0.5)">
              {settings?.banners?.about?.description || 'نحن نقدم حلولاً عقارية متكاملة تلبي احتياجات عملائنا بأعلى معايير الجودة والشفافية'}
            </Text>
          </Flex>
        </Container>
      </Box>
      
      {/* Stats Section */}
      <Box py={16} bg={lightBg}>
        <Container maxW="container.xl">
          <SimpleGrid columns={{ base: 2, md: 4 }} spacing={8}>
            {stats.map((stat, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.05, boxShadow: "xl" }}
                onHoverStart={() => setHoveredValue(index)}
                onHoverEnd={() => setHoveredValue(null)}
              >
                <VStack
                  bg={cardBg}
                  p={6}
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
                    bgGradient: "linear(to-r, yellow.400, yellow.600)",
                  }}
                >
                  <MotionBox
                    animate={hoveredValue === index ? { rotate: 360 } : { rotate: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                  >
                    <Icon as={stat.icon} w={8} h={8} color={accentColor} />
                  </MotionBox>
                  <Stat>
                    <StatNumber 
                      fontSize="3xl" 
                      fontWeight="bold" 
                      color={accentColor}
                      transition="all 0.3s ease"
                      _hover={{ transform: "scale(1.1)" }}
                    >
                      {stat.value}
                    </StatNumber>
                    <StatLabel fontSize="md" textAlign="center" color={textColor}>
                      {stat.label}
                    </StatLabel>
                  </Stat>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Story Section */}
      <Box py={16} id="story" bg={bgColor}>
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={12} alignItems="center">
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Heading
                  as="h2"
                  size="xl"
                  mb={6}
                  bgGradient="linear(to-r, yellow.400, yellow.600)"
                  bgClip="text"
                >
                  {settings?.aboutPage?.storyTitle || 'قصتنا'}
                </Heading>
                <Text fontSize="lg" color={textColor} mb={6}>
                  {settings?.aboutPage?.storyContent || 'تأسست وكالة ورسة العقارية في عام 2013 بهدف تقديم خدمات عقارية متكاملة تلبي احتياجات العملاء في موريتانيا. بدأنا بفريق صغير من الخبراء المتخصصين في مجال العقارات، وتمكنا من بناء سمعة طيبة في السوق بفضل التزامنا بالشفافية والجودة.'}
                </Text>
              </MotionBox>
            </GridItem>
            
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                position="relative"
              >
                <Box
                  position="relative"
                  rounded="xl"
                  overflow="hidden"
                  boxShadow="xl"
                >
                  <Image
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                    alt="Our Story"
                    objectFit="cover"
                    w="full"
                    h={{ base: '300px', md: '400px' }}
                  />
                  <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    bg="black"
                    opacity={0.3}
                  />
                </Box>
                
                <MotionBox
                  animate={badgeControls}
                  onHoverStart={() => setIsBadgeHovered(true)}
                  onHoverEnd={() => setIsBadgeHovered(false)}
                  position="absolute"
                  bottom={-6}
                  right={-6}
                  bg={accentColor}
                  color="white"
                  p={4}
                  rounded="xl"
                  boxShadow="lg"
                  zIndex={2}
                  cursor="pointer"
                >
                </MotionBox>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      
      {/* Values Section */}
      <Box py={16} bg={lightBg}>
        <Container maxW="container.xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            textAlign="center"
            mb={12}
          >
            <Heading
              as="h2"
              size="xl"
              mb={4}
              bgGradient="linear(to-r, yellow.400, yellow.600)"
              bgClip="text"
            >
              {settings?.about?.valuesTitle || 'قيمنا'}
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="3xl" mx="auto">
              {settings?.about?.valuesDescription || 'نؤمن بقيم أساسية توجه عملنا وتساعدنا على تقديم أفضل الخدمات لعملائنا'}
            </Text>
          </MotionBox>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {settings?.about?.values?.map((value, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <VStack
                  bg={cardBg}
                  p={6}
                  rounded="xl"
                  boxShadow="lg"
                  spacing={4}
                  align="center"
                >
                  <Icon as={value.icon} w={10} h={10} color={value.color} />
                  <Heading size="md">{value.title}</Heading>
                  <Text color={textColor} textAlign="center">
                    {value.description}
                  </Text>
                </VStack>
              </MotionBox>
            )) || [
              {
                icon: Shield,
                title: 'الشفافية',
                description: 'نؤمن بالشفافية الكاملة في جميع معاملاتنا العقارية',
                color: 'yellow.400',
              },
              {
                icon: Heart,
                title: 'الالتزام',
                description: 'نلتزم بتقديم أفضل الخدمات وتلبية احتياجات عملائنا',
                color: 'yellow.400',
              },
              {
                icon: Target,
                title: 'التميز',
                description: 'نسعى دائماً للتميز في مجال الخدمات العقارية',
                color: 'yellow.400',
              },
              {
                icon: Users,
                title: 'التعاون',
                description: 'نؤمن بأهمية التعاون مع عملائنا وشركائنا',
                color: 'yellow.400',
              },
            ].map((value, index) => (
              <MotionBox
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <VStack
                  bg={cardBg}
                  p={6}
                  rounded="xl"
                  boxShadow="lg"
                  spacing={4}
                  align="center"
                >
                  <Icon as={value.icon} w={10} h={10} color={value.color} />
                  <Heading size="md">{value.title}</Heading>
                  <Text color={textColor} textAlign="center">
                    {value.description}
                  </Text>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Services Section */}
      <Box py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            textAlign="center"
            mb={12}
          >
            <Heading
              as="h2"
              size="xl"
              mb={4}
              bgGradient="linear(to-r, yellow.400, yellow.600)"
              bgClip="text"
            >
              خدماتنا
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="3xl" mx="auto">
              نقدم مجموعة متنوعة من الخدمات العقارية لتلبية احتياجات عملائنا
            </Text>
          </MotionBox>
          
          <Tabs
            variant="enclosed"
            colorScheme="yellow"
            onChange={(index) => setActiveTab(index)}
            isFitted
            mb={8}
            bg={tabBg}
            borderColor={tabBorderColor}
          >
            <TabList mb="1em">
              <Tab color={textColor}>بيع وشراء</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                  {[
                    { icon: Home, title: 'منازل', description: 'بيع وشراء المنازل بجميع الأحجام والمواقع', color: 'yellow.400' },
                    { icon: Building2, title: 'شقق', description: 'بيع وشراء الشقق السكنية والتجارية', color: 'yellow.400' },
                    { icon: LandPlot, title: 'أراضي', description: 'بيع وشراء الأراضي السكنية والتجارية', color: 'yellow.400' },
                  ].map((service, index) => (
                    <MotionBox
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      whileHover={{ scale: 1.05, boxShadow: "xl" }}
                      onHoverStart={() => setHoveredService(index)}
                      onHoverEnd={() => setHoveredService(null)}
                    >
                      <VStack
                        bg={cardBg}
                        p={6}
                        rounded="xl"
                        boxShadow="lg"
                        borderWidth="1px"
                        borderColor={borderColor}
                        spacing={4}
                        align="start"
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
                          bg: service.color,
                        }}
                      >
                        <MotionBox
                          animate={hoveredService === index ? { rotate: 360 } : { rotate: 0 }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                        >
                          <Icon as={service.icon} w={8} h={8} color={service.color} />
                        </MotionBox>
                        <Heading 
                          size="md" 
                          color={headingColor}
                          transition="all 0.3s ease"
                          _hover={{ color: service.color }}
                        >
                          {service.title}
                        </Heading>
                        <Text color={textColor}>{service.description}</Text>
                      </VStack>
                    </MotionBox>
                  ))}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
      </Box>
      
      {/* Team Section */}
      <Box py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            textAlign="center"
            mb={12}
          >
            <Heading
              as="h2"
              size="xl"
              mb={4}
              bgGradient="linear(to-r, yellow.400, yellow.600)"
              bgClip="text"
            >
              فريقنا
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="3xl" mx="auto">
              فريق من الخبراء المتخصصين في مجال العقارات والاستثمار
            </Text>
          </MotionBox>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={8}>
            {settings?.teamMembers?.map((member, index) => (
              <MotionBox
                key={member._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                whileHover={{ scale: 1.05, boxShadow: "xl" }}
                onHoverStart={() => setHoveredTeam(index)}
                onHoverEnd={() => setHoveredTeam(null)}
              >
                <VStack
                  bg={cardBg}
                  p={6}
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
                    bgGradient: "linear(to-r, yellow.400, yellow.600)",
                  }}
                >
                  <Avatar
                    size="xl"
                    name={member.name}
                    src={member.image}
                    border="4px solid"
                    borderColor={accentColor}
                    transition="all 0.3s ease"
                    _hover={{
                      transform: "scale(1.1)",
                      borderColor: "yellow.600"
                    }}
                  />
                  <Heading size="md" color={headingColor}>{member.name}</Heading>
                  <Badge colorScheme="yellow">{member.position}</Badge>
                  <Text color={textColor} textAlign="center">
                    {member.bio}
                  </Text>
                  <HStack spacing={4} mt={2}>
                    {member.social?.facebook && (
                      <IconButton
                        icon={<FaFacebook />}
                        aria-label="Facebook"
                        variant="ghost"
                        colorScheme="yellow"
                        as="a"
                        href={member.social.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        _hover={{
                          transform: "translateY(-3px)",
                          boxShadow: "md",
                          bg: "yellow.50"
                        }}
                        transition="all 0.3s ease"
                      />
                    )}
                    {member.social?.twitter && (
                      <IconButton
                        icon={<FaTwitter />}
                        aria-label="Twitter"
                        variant="ghost"
                        colorScheme="yellow"
                        as="a"
                        href={member.social.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        _hover={{
                          transform: "translateY(-3px)",
                          boxShadow: "md",
                          bg: "yellow.50"
                        }}
                        transition="all 0.3s ease"
                      />
                    )}
                    {member.social?.instagram && (
                      <IconButton
                        icon={<FaInstagram />}
                        aria-label="Instagram"
                        variant="ghost"
                        colorScheme="yellow"
                        as="a"
                        href={member.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        _hover={{
                          transform: "translateY(-3px)",
                          boxShadow: "md",
                          bg: "yellow.50"
                        }}
                        transition="all 0.3s ease"
                      />
                    )}
                  </HStack>
                </VStack>
              </MotionBox>
            ))}
          </SimpleGrid>
        </Container>
      </Box>
      
      {/* Contact Section */}
      <Box py={16} bg={lightBg} id="contact">
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: '1fr', lg: '1fr' }} gap={12} alignItems="center">
            <GridItem>
              <MotionBox
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Heading
                  as="h2"
                  size="xl"
                  mb={6}
                  bgGradient="linear(to-r, yellow.400, yellow.600)"
                  bgClip="text"
                >
                  تواصل معنا
                </Heading>
                <Text fontSize="lg" color={textColor} mb={6}>
                  نحن هنا لمساعدتك في جميع احتياجاتك العقارية. تواصل معنا اليوم للحصول على استشارة مجانية.
                </Text>
                
                <VStack align="start" spacing={4} mb={8}>
                  <HStack 
                    _hover={{ transform: "translateX(5px)" }}
                    transition="all 0.3s ease"
                    cursor="pointer"
                  >
                    <Icon as={Phone} color={accentColor} />
                    <Text color={textColor}>{settings?.contactPage?.phone || settings?.contactPhone || ''}</Text>
                  </HStack>
                  <HStack 
                    _hover={{ transform: "translateX(5px)" }}
                    transition="all 0.3s ease"
                    cursor="pointer"
                  >
                    <Icon as={Mail} color={accentColor} />
                    <Text color={textColor}>{settings?.contactPage?.email || settings?.contactEmail || ''}</Text>
                  </HStack>
                  <HStack 
                    _hover={{ transform: "translateX(5px)" }}
                    transition="all 0.3s ease"
                    cursor="pointer"
                  >
                    <Icon as={MapPin} color={accentColor} />
                    <Text color={textColor}>{settings?.contactPage?.address || ''}</Text>
                  </HStack>
                </VStack>
                
                <HStack spacing={4}>
                  {settings?.socialMedia?.facebook && (
                    <IconButton
                      icon={<FaFacebook />}
                      aria-label="Facebook"
                      colorScheme="yellow"
                      variant="outline"
                      rounded="full"
                      as="a"
                      href={settings.socialMedia.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      _hover={{
                        transform: "translateY(-3px)",
                        boxShadow: "md",
                        bg: "yellow.50"
                      }}
                      transition="all 0.3s ease"
                    />
                  )}
                  {settings?.socialMedia?.twitter && (
                    <IconButton
                      icon={<FaTwitter />}
                      aria-label="Twitter"
                      colorScheme="yellow"
                      variant="outline"
                      rounded="full"
                      as="a"
                      href={settings.socialMedia.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      _hover={{
                        transform: "translateY(-3px)",
                        boxShadow: "md",
                        bg: "yellow.50"
                      }}
                      transition="all 0.3s ease"
                    />
                  )}
                  {settings?.socialMedia?.instagram && (
                    <IconButton
                      icon={<FaInstagram />}
                      aria-label="Instagram"
                      colorScheme="yellow"
                      variant="outline"
                      rounded="full"
                      as="a"
                      href={settings.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      _hover={{
                        transform: "translateY(-3px)",
                        boxShadow: "md",
                        bg: "yellow.50"
                      }}
                      transition="all 0.3s ease"
                    />
                  )}
                </HStack>
              </MotionBox>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      
      {/* Map Section */}
      <Box h={{ base: '300px', md: '400px' }} position="relative">
        {settings?.contactPage?.mapEmbedUrl && (
          <div dangerouslySetInnerHTML={{ __html: settings.contactPage.mapEmbedUrl }} />
        )}
      </Box>
      
      {/* Developer Section */}
      <Box py={16} bg={bgColor}>
        <Container maxW="container.xl">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            textAlign="center"
            mb={12}
          >
            <Heading
              as="h2"
              size="xl"
              mb={4}
              bgGradient="linear(to-r, yellow.400, yellow.600)"
              bgClip="text"
            >
              المطورين
            </Heading>
            <Text fontSize="lg" color={textColor} maxW="3xl" mx="auto">
              تم تطوير هذا الموقع بواسطة شركة الهلال الرقمية
            </Text>
          </MotionBox>

          <Box
            bg={cardBg}
            p={8}
            rounded="xl"
            boxShadow="lg"
            borderWidth="1px"
            borderColor={borderColor}
            maxW="2xl"
            mx="auto"
            textAlign="center"
          >
            <Image
              src="/elhilal.png"
              alt="شركة الهلال الرقمية"
              maxH="100px"
              mx="auto"
              mb={6}
            />
            <Text fontSize="lg" color={textColor} mb={6}>
              شركة الهلال الرقمية هي شركة متخصصة في تطوير الحلول التقنية والبرمجية. نحن نقدم خدمات تطوير المواقع والتطبيقات بجودة عالية وأسعار تنافسية.
            </Text>
            <Button
              as="a"
              href="https://wa.me/22242900600"
              target="_blank"
              leftIcon={<MessageCircle />}
              colorScheme="yellow"
              size="lg"
              _hover={{
                transform: "translateY(-3px)",
                boxShadow: "xl",
              }}
              transition="all 0.3s ease"
            >
              تواصل مع المطورين عبر واتساب
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default AboutUs; 