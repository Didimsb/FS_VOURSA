import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Heading,
  Text,
  Stack,
  Button,
  useColorModeValue,
  SimpleGrid,
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Flex,
  Spacer,
  useBreakpointValue,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  List,
  ListItem,
  ListIcon,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Progress,
  Tooltip,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Radio,
  RadioGroup,
  Image,
  Center,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Spinner,
  FormHelperText,
  Trash2,
  Icon
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Home,
  Edit2,
  Eye,
  DollarSign,
  Plus,
  X,
  Play,
  Upload,
  LogOut,
  Settings,
  Users,
  Copy,
  Trash2 as Trash2Icon,
  Building2,
  ArrowUp
} from 'lucide-react';
import { FaDollarSign, FaPhone, FaHome, FaMoneyBill, FaCalendar, FaUser, FaEye, FaChartLine } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { Link as RouterLink } from 'react-router-dom';
import { UserIcon } from 'lucide-react';
import Footer from '../components/Footer';
import { getPointsBalance, purchasePoints, deductPointsForProperty, getPointsTransactions } from '../services/PointsService';
import { useSettings } from '../context/SettingsContext';
import { createProperty, getAllProperties, getPropertyById, updateProperty, deleteProperty, getProperty } from '../services/PropertyService';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const MotionBox = motion(Box);

// Mock data - In a real app, this would come from an API
const mockStats = {
  totalProperties: 12,
  activeProperties: 8,
  totalViews: 1250,
  totalSales: 4500000, // Total sales amount in MRU
  monthlySales: 1200000, // Monthly sales amount in MRU
  monthlyInquiries: 12,
  monthlyViews: 350,
};

// Static list of banks - keep only one declaration
const BANKS = [
  { id: 'bankily', name: 'Bankily', image: '/images/banks/bank,ly.png' },
  { id: 'masrivi', name: 'Masrivi', image: '/images/banks/masrivi.png' },
  { id: 'sedad', name: 'Sedad', image: '/images/banks/sedad.png' },
  { id: 'click', name: 'Click', image: '/images/banks/click.png' },
  { id: 'bimbank', name: 'Bimbank', image: '/images/banks/bimbank.png' }
];

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, logout } = useAuth();
  const toast = useToast();
  
  // Modal and Alert Dialog hooks
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isMobileMenuOpen, onOpen: onMobileMenuOpen, onClose: onMobileMenuClose } = useDisclosure();
  const { isOpen: isAddPropertyOpen, onOpen: onAddPropertyOpen, onClose: onAddPropertyClose } = useDisclosure();
  const { isOpen: isInsufficientCreditsOpen, onOpen: onInsufficientCreditsOpen, onClose: onInsufficientCreditsClose } = useDisclosure();
  const { isOpen: isBuyCreditsOpen, onOpen: onBuyCreditsOpen, onClose: onBuyCreditsClose } = useDisclosure();
  const { isOpen: isPaymentSubmittedOpen, onOpen: onPaymentSubmittedOpen, onClose: onPaymentSubmittedClose } = useDisclosure();
  const cancelRef = React.useRef();
  
  // Fix for useColorModeValue hooks - move them to the top level
  const greenBg = useColorModeValue('green.50', 'green.900');
  const greenBorder = useColorModeValue('green.200', 'green.700');
  const greenText = useColorModeValue('green.700', 'green.300');
  const greenTextBold = useColorModeValue('green.800', 'green.200');
  const greenTextSmall = useColorModeValue('green.600', 'green.400');
  
  // Add more color mode values for dark mode support
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'white');
  const mutedTextColor = useColorModeValue('gray.600', 'gray.300');
  const primaryBg = useColorModeValue('primary.50', 'primary.900');
  const primaryBorder = useColorModeValue('primary.200', 'primary.700');
  const primaryText = useColorModeValue('primary.700', 'primary.300');
  const primaryTextBold = useColorModeValue('primary.800', 'primary.200');
  const blueBg = useColorModeValue('blue.50', 'blue.900');
  const blueBorder = useColorModeValue('blue.200', 'blue.700');
  const blueText = useColorModeValue('blue.700', 'blue.300');
  const yellowBg = useColorModeValue('yellow.50', 'yellow.900');
  const yellowBorder = useColorModeValue('yellow.200', 'yellow.700');
  const yellowText = useColorModeValue('yellow.800', 'yellow.200');
  
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  // Replace mock data with real state
  const [credits, setCredits] = useState(0);
  const [pointsTransactions, setPointsTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { settings } = useSettings();
  
  // Add new state variables
  const [pointsBalance, setPointsBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [properties, setProperties] = useState([]);
  const [latestProperties, setLatestProperties] = useState([]);
  const [additionalMediaFiles, setAdditionalMediaFiles] = useState([]);
  const [additionalMediaPreviews, setAdditionalMediaPreviews] = useState([]);
  const [mainPhotoPreview, setMainPhotoPreview] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState('');
  const [newProperty, setNewProperty] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    features: [],
    mainPhoto: null,
    additionalMedia: [],
    province: '',
    district: ''
  });
  
  // Add province-district mapping
  const provinceDistricts = {
    'ولاية نواكشوط الشمالية': [
      'مقاطعة دار النعيم',
      'مقاطعة تيارت',
      'مقاطعة توجنين'
    ],
    'ولاية نواكشوط الغربية': [
      'مقاطعة لكصر',
      'مقاطعة السبخة',
      'مقاطعة تفرغ زينة'
    ],
    'ولاية نواكشوط الجنوبية': [
      'مقاطعة عرفات',
      'مقاطعة الميناء',
      'مقاطعة الرياض'
    ],
    'ولاية الحوض الشرقي': [
      'مقاطعة امورج',
      'مقاطعة باسكنو',
      'مقاطعة جكني',
      'مقاطعة النعمة',
      'مقاطعة ولاتة',
      'مقاطعة تمبدغة'
    ],
    'ولاية الحوض الغربي': [
      'مقاطعة العيون',
      'مقاطعة كوبني',
      'مقاطعة تامشكط',
      'مقاطعة الطينطان'
    ],
    'ولاية العصابة': [
      'مقاطعة باركيول',
      'مقاطعة بومديد',
      'مقاطعة كرو',
      'مقاطعة كنكوصة',
      'مقاطعة كيفة'
    ],
    'ولاية كوركول': [
      'مقاطعة كيهيدي',
      'مقاطعة امبود',
      'مقاطعة مقامه',
      'مقاطعة مونكل'
    ],
    'ولاية البراكنة': [
      'مقاطعة ألاك',
      'مقاطعة بابابي',
      'مقاطعة بوكي',
      'مقاطعة امباني',
      'مقاطعة مقطع لحجار'
    ],
    'ولاية الترارزة': [
      'مقاطعة بوتلميت',
      'مقاطعة كرمسين',
      'مقاطعة المذرذره',
      'مقاطعة واد الناقة',
      'مقاطعة الركيز',
      'مقاطعة روصو'
    ],
    'ولاية آدرار': [
      'مقاطعة أطار',
      'مقاطعة شنقيط',
      'مقاطعة أوجفت',
      'مقاطعة وادان'
    ],
    'ولاية داخلة نواذيبو': [
      'مقاطعة نواذيبو',
      'مقاطعة الشامي'
    ],
    'ولاية تكانت': [
      'مقاطعة المجرية',
      'مقاطعة تيشيت',
      'مقاطعة تجكجة'
    ],
    'ولاية غيديماغا': [
      'مقاطعة ولد ينج',
      'مقاطعة سيليبابي'
    ],
    'ولاية تيرس زمور': [
      'مقاطعة بير أم اكرين',
      'مقاطعة فديرك',
      'مقاطعة الزويرات',
    ],
    'ولاية إينشيري': [
      'مقاطعة أكجوجت',
      'مقاطعة بنشاب'
    ]
  };

  // Add state for districts
  const [availableDistricts, setAvailableDistricts] = useState([]);

  // Add handler for province change
  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setNewProperty({
      ...newProperty,
      province: selectedProvince,
      district: '' // Reset district when province changes
    });
  };
  
  // Fetch seller's properties
  const fetchSellerProperties = async () => {
    try {
      if (!user?._id) {
        // console.log('User ID not available yet');
        return;
      }

      setIsLoading(true);
      const response = await axiosInstance.get(`/properties/seller/properties?sellerId=${user._id}`);
      if (response.data && response.data.success) {
        setProperties(response.data.properties);
      } else {
        console.error('Error in response format:', response.data);
        toast({
          title: "خطأ في تنسيق البيانات",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "خطأ في جلب العقارات",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSellerStats = async () => {
    try {
      if (!user?._id) {
        // console.log('User ID not available yet');
        return;
      }

      setIsLoading(true);
      const response = await axiosInstance.get(`/properties/seller/stats?sellerId=${user._id}`);
      if (response.data && response.data.success) {
        setStats(response.data.stats);
      } else {
        console.error('Error in response format:', response.data);
        toast({
          title: "خطأ في تنسيق البيانات",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "خطأ في جلب الإحصائيات",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSellerCustomers = async () => {
    try {
      if (!user?._id) {
        // console.log('User ID not available yet');
        return;
      }

      setIsLoading(true);
      const response = await axiosInstance.get(`/properties/seller/customers?sellerId=${user._id}`);
      if (response.data && response.data.success) {
        setCustomers(response.data.customers);
      } else {
        console.error('Error in response format:', response.data);
        toast({
          title: "خطأ في تنسيق البيانات",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "خطأ في جلب العملاء",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Wait for user data to be available
      if (!user || !user._id) {
        // console.log('Waiting for user data...');
        return;
      }

      try {
        // Fetch all data in parallel
        await Promise.all([
          fetchSellerProperties(),
          fetchSellerStats(),
          fetchSellerCustomers()
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: "يرجى تحديث الصفحة",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [user]); // Changed dependency to user object

  // Fetch points balance
  const fetchPointsBalance = async () => {
    try {
      const response = await getPointsBalance();
      // console.log('Points balance response:', response); // Debug log
      
      if (response && response.credits !== undefined) {
        const credits = parseInt(response.credits, 10);
        if (!isNaN(credits)) {
          setPointsBalance(credits);
          setCredits(credits);
          //  console.log('Updated credits:', credits); // Debug log
        } else {
          console.error('Invalid credits value:', response.credits);
          toast({
            title: "خطأ في قيمة النقاط",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      } else {
        console.error('Invalid response format:', response);
        toast({
          title: "خطأ في تنسيق البيانات",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching points balance:', error);
      toast({
        title: "خطأ في جلب رصيد النقاط",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Fetch latest properties
  const fetchLatestProperties = async () => {
    try {
      const response = await axiosInstance.get('/properties/latest');
      if (response.data.success) {
        setLatestProperties(response.data.properties);
      }
    } catch (error) {
      console.error('Error fetching latest properties:', error);
      toast({
        title: "خطأ في جلب آخر العقارات",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Fetch points transactions
  const fetchPointsTransactions = async () => {
    try {
      const response = await getPointsTransactions();
      if (response && response.success && response.transactions) {
        setPointsTransactions(response.transactions);
      } else {
        console.error('Error in response format:', response);
        toast({
          title: "خطأ في تنسيق البيانات",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error fetching points transactions:', error);
      toast({
        title: "خطأ في جلب معاملات النقاط",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await Promise.all([
          fetchPointsBalance(),
          fetchSellerProperties(),
          fetchPointsTransactions()
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "خطأ في تحميل البيانات",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user._id]); // Add user._id as dependency to refetch when user changes

  // Add effect to refetch points balance after successful purchase
  useEffect(() => {
    if (isPaymentSubmittedOpen) {
      fetchPointsBalance();
    }
  }, [isPaymentSubmittedOpen]);
  
  // Add effect to fetch customers when the customers tab is selected
  useEffect(() => {
    if (activeTab === 1) { // 1 is the index for the customers tab
      fetchCustomers();
    }
  }, [activeTab]);
  
  // Mock data for credits
  const creditCostPerProperty = settings?.pointsPerProperty;
  
  // Payment methods with account numbers
  const paymentMethods = settings?.paymentMethods || [];
  
  // Credit pricing
  const creditPrice = settings?.pointCost || 0;
  
  // State for buy credits form
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [creditsToBuy, setCreditsToBuy] = useState(settings?.minPointsToBuy || 0);
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState('');
  
  // Add new state for media viewer modal
  const [isMediaViewerOpen, setIsMediaViewerOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  
  // Filter properties based on search query
  const filteredProperties = properties.filter(property => 
    property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    property.price.toString().includes(searchQuery)
  );

  // Add function to check if form is valid
  const isFormValid = () => {
    return (
      newProperty.title.trim() !== '' &&
      newProperty.description.trim() !== '' &&
      newProperty.price.toString().trim() !== '' &&
      newProperty.location.trim() !== '' &&
      newProperty.type !== '' &&
      newProperty.bedrooms.toString().trim() !== '' &&
      newProperty.bathrooms.toString().trim() !== '' &&
      newProperty.area.toString().trim() !== '' &&
      newProperty.mainPhoto !== null
    );
  };

  // Add function to handle main photo upload
  const handleMainPhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size
      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        toast({
          title: "ملف كبير جداً",
          description: `الملف ${file.name} يتجاوز الحد الأقصى (100 ميجابايت)`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setMainPhotoPreview(reader.result);
        setNewProperty(prev => ({
          ...prev,
          mainPhoto: file
        }));
        
        toast({
          title: "تم إضافة الصورة الرئيسية",
          description: `تم إضافة ${file.name} بنجاح`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add function to handle additional media upload (photos and videos)
  const handleAdditionalMediaUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFiles = [...additionalMediaFiles];
      const newPreviews = [...additionalMediaPreviews];
      
      // Check file sizes
      const maxImageSize = 500 * 1024 * 1024; // 500MB for images
      const maxVideoSize = 100 * 1024 * 1024; // 100MB for videos (3-4 minutes)
      
      const oversizedFiles = files.filter(file => {
        const isVideo = file.type.startsWith('video/');
        const maxSize = isVideo ? maxVideoSize : maxImageSize;
        return file.size > maxSize;
      });
      
      if (oversizedFiles.length > 0) {
        const oversizedNames = oversizedFiles.map(f => f.name).join(', ');
        toast({
          title: "ملفات كبيرة جداً",
          description: `الملفات التالية تتجاوز الحد الأقصى: ${oversizedNames}. الحد الأقصى للفيديو: 100 ميجابايت (1-2 دقائق)، للصور: 100 ميجابايت`,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        return;
      }
      
      files.forEach(file => {
        // Check if file is video and show duration warning
        if (file.type.startsWith('video/')) {
          const video = document.createElement('video');
          video.preload = 'metadata';
          video.onloadedmetadata = () => {
            const durationInMinutes = video.duration / 60;
            if (durationInMinutes > 2) {
              toast({
                title: "فيديو طويل جداً",
                description: `الفيديو ${file.name} طويل جداً (${Math.round(durationInMinutes)} دقيقة). الحد الأقصى هو 2 دقيقة للخطة المجانية.`,
                status: "error",
                duration: 4000,
                isClosable: true,
              });
              // Remove the file from the array
              const fileIndex = newFiles.indexOf(file);
              if (fileIndex > -1) {
                newFiles.splice(fileIndex, 1);
                newPreviews.splice(fileIndex, 1);
                setAdditionalMediaFiles([...newFiles]);
                setAdditionalMediaPreviews([...newPreviews]);
              }
              return;
            } else if (durationInMinutes > 1) {
              toast({
                title: "فيديو طويل",
                description: `الفيديو ${file.name} طويل (${Math.round(durationInMinutes)} دقيقة). قد يستغرق الرفع وقتاً طويلاً.`,
                status: "warning",
                duration: 4000,
                isClosable: true,
              });
            }
          };
          video.src = URL.createObjectURL(file);
        }
        
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviews.push({
            url: reader.result,
            type: file.type.startsWith('image/') ? 'image' : 'video',
            name: file.name,
            size: file.size
          });
          setAdditionalMediaPreviews([...newPreviews]);
        };
        reader.readAsDataURL(file);
        newFiles.push(file);
      });
      
      setAdditionalMediaFiles(newFiles);
      setNewProperty(prev => ({
        ...prev,
        additionalMedia: newFiles
      }));
      
      toast({
        title: "تم إضافة الملفات",
        description: `تم إضافة ${files.length} ملف بنجاح`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // Add function to remove media
  const handleRemoveMedia = (index) => {
    const newFiles = additionalMediaFiles.filter((_, i) => i !== index);
    const newPreviews = additionalMediaPreviews.filter((_, i) => i !== index);
    setAdditionalMediaFiles(newFiles);
    setAdditionalMediaPreviews(newPreviews);
    setNewProperty(prev => ({
      ...prev,
      additionalMedia: newFiles
    }));
  };

  const handleLogout = () => {
    logout();
    toast({
      title: 'تم تسجيل الخروج بنجاح',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'متاح':
        return 'green';
      case 'تم البيع':
        return 'red';
      default:
        return 'gray';
    }
  };
  
  const handleViewProperty = (property) => {
    // console.log('Selected Property Data:', {
    //   id: property._id,
    //   title: property.title,
    //   description: property.description,
    //   price: property.price,
    //   location: property.location,
    //   type: property.type,
    //   status: property.status,
    //   bedrooms: property.bedrooms,
    //   bathrooms: property.bathrooms,
    //   area: property.area,
    //   images: property.images,
    //   features: property.features,
    //   amenities: property.amenities,
    //   createdBy: property.createdBy,
    //   userRole: property.userRole,
    //   createdAt: property.createdAt,
    //   updatedAt: property.updatedAt
    // });
    setSelectedProperty(property);
    onViewOpen();
  };

  const handleEditProperty = (property) => {
    // Set the selected property with all its data
    setSelectedProperty({
      ...property,
      propertyType: property.propertyType,
      mainPhoto: property.images?.[0] || null, // Set first image as main photo
      additionalMedia: property.images?.slice(1) || [], // Set remaining images as additional media
      features: property.features || [],
      province: property.province || '',
      district: property.district || ''
    });
    setIsEditing(true);
    onEditOpen();
  };

  const handleSaveEdit = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      
      // Append all property fields
      Object.keys(selectedProperty).forEach(key => {
        if (key === 'images') return; // Skip images as they are handled separately
        if (key === 'mainPhoto' && selectedProperty.mainPhoto) {
        formData.append('mainPhoto', selectedProperty.mainPhoto);
        } else if (key === 'additionalMedia' && selectedProperty.additionalMedia) {
          selectedProperty.additionalMedia.forEach((file, index) => {
            formData.append(`additionalMedia`, file);
          });
        } else if (key === 'features' && selectedProperty.features) {
          formData.append('features', JSON.stringify(selectedProperty.features));
        } else if (key === 'province' || key === 'district') {
          formData.append(key, selectedProperty[key]);
        } else if (selectedProperty[key] !== null && selectedProperty[key] !== undefined) {
          formData.append(key, selectedProperty[key]);
        }
      });

      await updateProperty(selectedProperty._id, formData);
    toast({
        title: 'تم التحديث بنجاح',
        status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onEditClose();
      fetchProperties();
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: 'خطأ في التحديث',
        description: error.response?.data?.message || 'حدث خطأ أثناء تحديث العقار',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAddProperty = () => {
    if (credits >= creditCostPerProperty) {
      setIsAddingProperty(true);
      onAddPropertyOpen();
    } else {
      onInsufficientCreditsOpen();
    }
  };

  // Add new state for upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');

  const handleSaveNewProperty = async () => {
    try {
      // Check points balance first
      const balanceResponse = await getPointsBalance();
      if (balanceResponse.balance < settings?.costPerProperty) {
        toast({
          title: "نقاط غير كافية",
          description: `تحتاج إلى ${settings?.costPerProperty} نقطة لإضافة عقار جديد. رصيدك الحالي: ${balanceResponse.balance}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setIsLoading(true);
      setIsUploading(true);
      setUploadProgress(0);
      setUploadStatus('جاري التحضير...');

      // Create FormData for the entire request
      const formData = new FormData();
      
      // Debug log before processing
      // console.log('Original newProperty:', newProperty);
      
      // Add all property data
      Object.keys(newProperty).forEach(key => {
        if (key === 'features') {
          formData.append(key, JSON.stringify(newProperty[key]));
        } else if (key === 'type') {
          // Map property type to backend enum values
          const propertyTypeMap = {
            'أرض للبيع': 'أرض للبيع',
            'منزل للبيع': 'منزل للبيع',
            'منزل للايجار': 'منزل للايجار',
            'شقة للايجار': 'شقة للايجار',
            
          };
          
          const mappedPropertyType = propertyTypeMap[newProperty.type] || 'منزل للبيع';
          // console.log('Mapping property type:', { original: newProperty.type, mapped: mappedPropertyType });
          formData.append('propertyType', mappedPropertyType);
        } else if (key === 'status') {
          // Map status to backend enum values
          const statusMap = {
            'للايجار': 'للايجار',
            'للبيع': 'للبيع',
            'مؤجر': 'مؤجر',
            'بيع': 'بيع'
          };
          
          const mappedStatus = statusMap[newProperty.status] || 'للبيع';
          // console.log('Mapping status:', { original: newProperty.status, mapped: mappedStatus });
          formData.append('status', mappedStatus);
        } else if (key !== 'mainPhoto' && key !== 'additionalMedia' && key !== 'propertyType') {
          formData.append(key, newProperty[key]);
        }
      });

      // Add main photo
      if (newProperty.mainPhoto) {
        formData.append('mainPhoto', newProperty.mainPhoto, newProperty.mainPhoto.name);
      }

      // Add additional media files
      if (additionalMediaFiles.length > 0) {
        additionalMediaFiles.forEach((file, index) => {
          formData.append(`additionalMedia`, file, file.name);
        });
      }

      // Add user role
      formData.append('userRole', user.role);

      // Debug log to see what's being sent
      // console.log('Final FormData contents:');
      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ': ' + pair[1]);
      // }

      setUploadStatus('جاري رفع الملفات...');

      // Make a single API call that handles both property creation and points deduction
      const response = await axiosInstance.post('/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
          setUploadStatus(`جاري الرفع... ${percentCompleted}%`);
        }
      });
      
      if (response.data.success) {
        setProperties([response.data.property, ...properties]);
        setPointsBalance(response.data.remainingPoints);
        
        toast({
          title: "تم الإضافة بنجاح",
          description: "تم إضافة العقار بنجاح وهو قيد المراجعة",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
    
        // Reset form
        setNewProperty({
          title: '',
          description: '',
          price: '',
          location: '',
          type: '',
          bedrooms: '',
          bathrooms: '',
          area: '',
          features: [],
          mainPhoto: null,
          additionalMedia: [],
          province: '',
          district: '',
          status: ''
        });
        setMainPhotoPreview(null);
        setAdditionalMediaPreviews([]);
        setAdditionalMediaFiles([]);
        onAddPropertyClose();
      }
    } catch (error) {
      console.error('Error saving property:', error);
      console.error('Error details:', error.response?.data);
      
      let errorMessage = "حدث خطأ أثناء إضافة العقار";
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "خطأ في الإضافة",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStatus('');
    }
  };
    
  const handleBuyCredits = async () => {
    if (!selectedPaymentMethod || !paymentScreenshot) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار طريقة الدفع ورفع صورة إثبات الدفع",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    try {
      setIsLoading(true);

      // Upload screenshot to server endpoint
      const formData = new FormData();
      formData.append('file', paymentScreenshot);
      
      const uploadResponse = await axiosInstance.post(
        '/upload/cloudinary',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      
      // The server returns secure_url in the response
      const screenshotUrl = uploadResponse.data.secure_url;
      
      if (!screenshotUrl) {
        throw new Error("فشل في رفع صورة إثبات الدفع");
      }
      
      // console.log("Screenshot URL:", screenshotUrl); // Debug log
      
      // Send purchase request
      const purchaseResponse = await purchasePoints({
        amount: creditsToBuy,
        paymentMethodId: selectedPaymentMethod.bankId,
        screenshotUrl: screenshotUrl
      });

      if (purchaseResponse.success) {
        toast({
          title: "تم استلام الطلب",
          description: "سيتم مراجعة طلبك من قبل الإدارة. قد تستغرق العملية حتى 24 ساعة",
          status: "info",
          duration: 5000,
          isClosable: true,
        });

        // Update transactions list
        setPointsTransactions([purchaseResponse.transaction, ...pointsTransactions]);

        // Close modal and reset form
    onBuyCreditsClose();
        setCreditsToBuy(settings?.minPointsToBuy || 200);
        setSelectedPaymentMethod(null);
        setPaymentScreenshot(null);
        setPaymentScreenshotPreview(null);
      }
    } catch (error) {
      console.error('Error purchasing points:', error);
      let errorMessage = "حدث خطأ أثناء شراء النقاط";
      
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = "لم يتم استلام رد من الخادم. يرجى المحاولة مرة أخرى";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "خطأ",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleScreenshotChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPaymentScreenshot(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentScreenshotPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "تم النسخ",
      description: "تم نسخ الرقم إلى الحافظة",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };
  
  // Function to handle media click
  const handleMediaClick = (property) => {
    setSelectedMedia(property);
    setIsMediaViewerOpen(true);
  };
  
  // Function to mark property as sold
  const handleMarkAsSold = (property) => {
    // In a real app, this would make an API call to update the property status
    toast({
      title: 'تم تحديث حالة العقار',
      description: `تم تحديث حالة العقار "${property.title}" إلى "تم البيع"`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Mobile-friendly property card component
  const PropertyCard = ({ property }) => {
    if (!property) {
      return null;
    }

    return (
      <Card 
        bg={bgColor} 
        borderWidth="1px" 
        borderColor={borderColor} 
        borderRadius="lg" 
        overflow="hidden"
        mb={4}
      >
        <CardHeader pb={0}>
          <Flex justify="space-between" align="center">
            <Heading size="sm">{property.title || 'بدون عنوان'}</Heading>
            <Badge colorScheme={getStatusColor(property.status)}>
              {property.status || 'غير محدد'}
            </Badge>
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack align="stretch" spacing={2}>
            <Flex justify="space-between">
              <Text fontWeight="bold">النوع:</Text>
              <Badge>
                {property.type === 'villa' ? 'فيلا' :
                 property.type === 'apartment' ? 'شقة' : 'أرض'}
              </Badge>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">السعر:</Text>
              <Text>{property.price || 0} أوقية</Text>
            </Flex>
            <Flex justify="space-between">
              <Text fontWeight="bold">المشاهدات:</Text>
              <Text>{property.views || 0}</Text>
            </Flex>
            {/* {property.type !== 'land' && (
              // <>
              //   <Flex justify="space-between">
              //     <Text fontWeight="bold">غرف النوم:</Text>
              //     <Text>{property.bedrooms || 0}</Text>
              //   </Flex>
              //   <Flex justify="space-between">
              //     <Text fontWeight="bold">الحمامات:</Text>
              //     <Text>{property.bathrooms || 0}</Text>
              //   </Flex>
              // </>
            )} */}
          </VStack>
        </CardBody>
        <CardFooter>
          <HStack spacing={2} width="100%" justify="flex-end">
            <IconButton
              icon={<Eye />}
              size="sm"
              variant="ghost"
              aria-label="عرض"
              onClick={() => handleViewProperty(property)}
            />
            <IconButton
              icon={<Edit2 />}
              size="sm"
              variant="ghost"
              colorScheme="blue"
              aria-label="تعديل"
              onClick={() => handleEditProperty(property)}
            />
            {property.status !== 'بيع' && property.status !== 'مؤجر' && (
              <Tooltip label="تحديد كمباع">
                <IconButton
                  icon={<Icon as={FaDollarSign} />}
                  size="sm"
                  variant="ghost"
                  colorScheme="green"
                  aria-label="تحديد كمباع"
                  onClick={() => {
                    setSelectedProperty(property);
                    setIsMarkSoldModalOpen(true);
                  }}
                />
              </Tooltip>
            )}
          </HStack>
        </CardFooter>
      </Card>
    );
  };

  // Mobile sidebar drawer
  const MobileSidebar = () => (
    <Drawer
      isOpen={isMobileMenuOpen}
      placement="right"
      onClose={onMobileMenuClose}
      size="xs"
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">القائمة</DrawerHeader>
        <DrawerBody>
          <VStack spacing={4} align="stretch" mt={4}>
            <Button
              leftIcon={<Home />}
              variant={activeTab === 0 ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              onClick={() => {
                setActiveTab(0);
                onMobileMenuClose();
              }}
            >
              لوحة التحكم
            </Button>
            <Button
              leftIcon={<Building2 />}
              variant={activeTab === 1 ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              onClick={() => {
                setActiveTab(1);
                onMobileMenuClose();
              }}
            >
              العقارات
            </Button>
            <Button
              leftIcon={<Users />}
              variant={activeTab === 2 ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              onClick={() => {
                setActiveTab(2);
                onMobileMenuClose();
              }}
            >
              العملاء
            </Button>
            <Button
              leftIcon={<Settings />}
              variant={activeTab === 3 ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              onClick={() => {
                setActiveTab(3);
                onMobileMenuClose();
              }}
            >
              الإعدادات
            </Button>
            <Divider />
            <Button
              leftIcon={<LogOut />}
              variant="ghost"
              colorScheme="red"
              justifyContent="flex-start"
              onClick={() => {
                handleLogout();
                onMobileMenuClose();
              }}
            >
              تسجيل الخروج
            </Button>
          </VStack>
        </DrawerBody>
        <DrawerFooter borderTopWidth="1px">
          <Button variant="outline" mr={3} onClick={onMobileMenuClose}>
            إغلاق
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );

  // Update property creation to use points
  const handleCreateProperty = async (propertyData) => {
    try {
      // First, try to deduct points
      await deductPointsForProperty();
      
      // If deduction successful, create property
      const response = await createProperty(propertyData);
      
      // Refresh points balance
      const balanceResponse = await getPointsBalance();
      setCredits(balanceResponse.credits);
      
      toast({
        title: 'تم إضافة العقار بنجاح',
        description: `تم خصم ${settings.pointsPerProperty} نقطة من رصيدك. الرصيد المتبقي: ${balanceResponse.credits} نقطة`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      return response;
    } catch (error) {
      toast({
        title: 'خطأ',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw error;
    }
  };

  const handlePointsDeduction = async () => {
    try {
      const response = await deductPointsForProperty();
      return response;
    } catch (error) {
      throw new Error(error.message || 'حدث خطأ أثناء خصم النقاط');
    }
  };

  const createProperty = async (propertyData) => {
    try {
      const formData = new FormData();
      
      // Append all property data
      Object.keys(propertyData).forEach(key => {
        if (key === 'mainPhoto' || key === 'additionalMedia') {
          // Handle files separately
          if (key === 'mainPhoto' && propertyData[key]) {
            formData.append('mainPhoto', propertyData[key]);
          }
          if (key === 'additionalMedia') {
            propertyData[key].forEach((file, index) => {
              formData.append(`additionalMedia`, file);
            });
          }
        } else if (key === 'features') {
          // Convert features array to JSON string
          formData.append('features', JSON.stringify(propertyData[key]));
        } else if (key === 'type') {
          // Map 'type' to 'propertyType' for the server
          formData.append('propertyType', propertyData[key]);
        } else {
          formData.append(key, propertyData[key]);
        }
      });

      const response = await axios.post('/api/properties', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'حدث خطأ أثناء إضافة العقار');
    }
  };

  // Add updateProperty function
  const updateProperty = async (id, formData) => {
    try {
      const response = await axiosInstance.put(`/properties/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  // Add fetchProperties function
  const fetchProperties = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/properties/seller/properties', {
        params: {
          sellerId: user._id
        }
      });
      setProperties(response.data.properties);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: 'خطأ في جلب العقارات',
        description: error.response?.data?.message || 'حدث خطأ أثناء جلب العقارات',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const [isMarkSoldModalOpen, setIsMarkSoldModalOpen] = useState(false);
  const [saleDetails, setSaleDetails] = useState({
    customerName: '',
    customerPhone: '',
    agreedPrice: ''
  });

  const handleMarkSold = async () => {
    try {
      const endpoint = selectedProperty.status === 'للايجار' ? 'rented' : 'sold';
      const response = await axiosInstance.post(`/properties/${selectedProperty._id}/${endpoint}`, saleDetails);

      if (response.data.success) {
        toast({
          title: 'تم بنجاح',
          description: `تم تسجيل عملية ${selectedProperty.status === 'للايجار' ? 'التأجير' : 'البيع'} بنجاح`,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top'
        });
        setIsMarkSoldModalOpen(false);
        setSaleDetails({
          customerName: '',
          customerPhone: '',
          agreedPrice: ''
        });
        fetchProperties(); // Refresh the properties list
      }
    } catch (error) {
      console.error('Error marking property:', error);
      toast({
        title: 'خطأ',
        description: error.response?.data?.message || 'حدث خطأ أثناء تسجيل العملية',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
    }
  };

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);
      // console.log('Fetching customers for seller:', user._id);
      
      // Use the correct endpoint from propertyRoutes.js
      const response = await axiosInstance.get(`/properties/seller/customers?sellerId=${user._id}`);
      // console.log('Customers API Response:', response);
      
      if (response.data && response.data.success) {
        setCustomers(response.data.customers || []);
        // console.log('Customers state updated:', response.data.customers);
      } else {
        console.error('Invalid response format:', response.data);
        setError('تنسيق البيانات غير صالح');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      console.error('Error response:', error.response);
      setError(error.response?.data?.message || 'حدث خطأ أثناء جلب بيانات العملاء');
    } finally {
      setIsLoading(false);
    }
  };

  // Update the useEffect to fetch customers when the tab is active
  useEffect(() => {
    if (activeTab === 2) { // 2 is the index for the customers tab
      fetchCustomers();
    }
  }, [activeTab, user._id]); // Add user._id as dependency

  const [stats, setStats] = useState({
    totalProperties: 0,
    activeProperties: 0,
    totalViews: 0,
    monthlyViews: 0,
    totalSales: 0,
    monthlySales: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // console.log('Fetching stats...');
        const response = await axiosInstance.get('/properties/seller/stats');
        // console.log('Stats response:', response.data);
        setStats(response.data.stats);
        // console.log('Updated stats state:', response.data.stats);
      } catch (error) {
        console.error('Error fetching stats:', error);
        toast({
          title: 'خطأ',
          description: 'حدث خطأ أثناء جلب الإحصائيات',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    };

    fetchStats();
  }, [user._id]);

  const propertyTypes = [
    'أرض للبيع',
    'منزل للبيع',
    'منزل للايجار',
    'شقة للايجار',
    
  ];

  const propertyStatuses = {
    'أرض للبيع': ['للبيع', 'بيع'],
    'منزل للبيع': ['للبيع', 'بيع'],
    'منزل للايجار': ['للايجار', 'مؤجر'],
    'شقة للايجار': ['للايجار', 'مؤجر']
  };

  const handlePropertyTypeChange = (e) => {
    const selectedType = e.target.value;
    let defaultStatus = 'للبيع';
    
    // Set default status based on property type
    if (selectedType.includes('للايجار')) {
      defaultStatus = 'للايجار';
    }
    
    setNewProperty(prev => {
      const updated = {
        ...prev,
        type: selectedType,
        status: defaultStatus
      };
      // console.log('Property type changed:', updated);
      return updated;
    });
  };

  const [localSettings, setLocalSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    whatsapp: user?.whatsapp || ''
  });

  const handleSaveSettings = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.put('/users/profile', localSettings);
      
      if (response.data.success) {
        toast({
          title: 'تم الحفظ',
          description: 'تم حفظ الإعدادات بنجاح',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حفظ الإعدادات',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingsChange = (field, value) => {
    setLocalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box overflowX="hidden" width="100%" maxW="100vw">
      <Container maxW="container.xl" py={isMobile ? 4 : 10} px={isMobile ? 2 : 4} bg={bgColor} overflow="hidden">
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          width="100%"
          maxW="100%"
        >
          <Grid 
            templateColumns={{ base: '1fr', lg: '250px 1fr' }} 
            gap={isMobile ? 4 : 8}
            width="100%"
            maxW="100%"
          >
            {/* Stats Section */}
            <Box 
              gridColumn={{ base: '1', lg: '2' }} 
              mb={6}
              width="100%"
              maxW="100%"
              overflow="hidden"
            >
              <SimpleGrid 
                columns={{ base: 1, md: 2, lg: 4 }} 
                spacing={6} 
                mb={8}
                width="100%"
                maxW="100%"
              >
                <Stat
                  label="إجمالي العقارات"
                  value={stats.totalProperties}
                  helpText={`${stats.activeProperties} نشط`}
                  icon={FaHome}
                />
                <Stat
                  label="إجمالي المشاهدات"
                  value={stats.totalViews}
                  helpText={`${stats.monthlyViews} هذا الشهر`}
                  icon={FaEye}
                />
                <Stat
                  label="إجمالي المبيعات"
                  value={`${stats.totalSalesAmount?.toLocaleString() || 0} MRU`}
                  helpText={`${stats.monthlySales} هذا الشهر`}
                  icon={FaChartLine}
                />
                <Stat
                  label="رصيد النقاط"
                  value={credits}
                  helpText={`${creditCostPerProperty} نقطة لكل عقار`}
                  icon={FaMoneyBill}
                />
              </SimpleGrid>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={isMobile ? 3 : 6}>
                <Stat
                  bg={bgColor}
                  p={isMobile ? 3 : 6}
                  rounded="xl"
                  boxShadow="xl"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <StatLabel>إجمالي العقارات</StatLabel>
                  <StatNumber>{stats.totalProperties}</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {stats.activeProperties} متاح
                  </StatHelpText>
                </Stat>

                <Stat
                  bg={bgColor}
                  p={isMobile ? 3 : 6}
                  rounded="xl"
                  boxShadow="xl"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <StatLabel>إجمالي المشاهدات</StatLabel>
                  <StatNumber>{stats.totalViews}</StatNumber>
                  
                </Stat>

                <Stat
                  bg={bgColor}
                  p={isMobile ? 3 : 6}
                  rounded="xl"
                  boxShadow="xl"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <StatLabel>إجمالي المبيعات</StatLabel>
                  <StatNumber>{stats.totalSalesAmount?.toLocaleString() || 0} MRU</StatNumber>
                  <StatHelpText>
                    <StatArrow type="increase" />
                    {stats.monthlySales.toLocaleString()} هذا الشهر
                  </StatHelpText>
                </Stat>

                <Stat
                  bg={bgColor}
                  p={isMobile ? 3 : 6}
                  rounded="xl"
                  boxShadow="xl"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <StatLabel>رصيد النقاط</StatLabel>
                  <StatNumber>{credits}</StatNumber>
                  <StatHelpText>
                    {creditCostPerProperty} نقطة لكل عقار
                  </StatHelpText>
                  <Button 
                    size="sm" 
                    colorScheme="green" 
                    mt={2} 
                    onClick={onBuyCreditsOpen}
                    leftIcon={<Plus />}
                  >
                    شراء نقاط
                  </Button>
                </Stat>
              </SimpleGrid>
            </Box>

            {/* Mobile Header */}
            {isMobile && (
              <Flex 
                bg={bgColor} 
                p={4} 
                rounded="lg" 
                boxShadow="md" 
                borderWidth="1px" 
                borderColor={borderColor}
                mb={4}
                justify="space-between"
                align="center"
              >
                <Heading size="md">لوحة التحكم</Heading>
                <IconButton
                  icon={<Menu />}
                  variant="ghost"
                  aria-label="القائمة"
                  onClick={onMobileMenuOpen}
                />
              </Flex>
            )}

            {/* Sidebar - Hidden on mobile */}
            {!isMobile && (
              <Box
                bg={bgColor}
                p={6}
                rounded="xl"
                boxShadow="xl"
                borderWidth="1px"
                borderColor={borderColor}
                position="sticky"
                top={4}
                height="fit-content"
              >
                <Stack spacing={6}>
                  <Stack align="center" spacing={4}>
                    <Avatar
                      size="xl"
                      name={user?.name}
                      src={user?.avatar}
                    />
                    <Stack align="center" spacing={1}>
                      <Text fontWeight="bold" fontSize="lg">
                        {user?.name}
                      </Text>
                      <Text color={mutedTextColor} fontSize="sm">
                        {user?.email}
                      </Text>
                    </Stack>
                    
                    {/* Credits Display */}
                    <Box 
                      w="100%" 
                      p={3} 
                      bg={greenBg} 
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={greenBorder}
                    >
                      <VStack spacing={1}>
                        <Text fontWeight="bold" color={greenText}>
                          رصيد النقاط
                        </Text>
                        <Text fontSize="xl" fontWeight="bold" color={greenTextBold}>
                          {credits}
                        </Text>
                        <Text fontSize="xs" color={greenTextSmall}>
                          {creditCostPerProperty} نقطة لكل عقار
                        </Text>
                        <Button 
                          size="sm" 
                          colorScheme="green" 
                          mt={2} 
                          onClick={onBuyCreditsOpen}
                          leftIcon={<Plus />}
                        >
                          شراء نقاط
                        </Button>
                      </VStack>
                    </Box>
                  </Stack>
                  
                  <Divider />
                  
                  <Stack spacing={2}>
                    <Button
                      leftIcon={<Home />}
                      variant={activeTab === 0 ? 'solid' : 'ghost'}
                      justifyContent="flex-start"
                      onClick={() => setActiveTab(0)}
                    >
                      لوحة التحكم
                    </Button>
                    <Button
                      leftIcon={<Building2 />}
                      variant={activeTab === 1 ? 'solid' : 'ghost'}
                      justifyContent="flex-start"
                      onClick={() => setActiveTab(1)}
                    >
                      العقارات
                    </Button>
                    <Button
                      leftIcon={<Users />}
                      variant={activeTab === 2 ? 'solid' : 'ghost'}
                      justifyContent="flex-start"
                      onClick={() => setActiveTab(2)}
                    >
                      العملاء
                    </Button>
                    <Button
                      leftIcon={<Settings />}
                      variant={activeTab === 3 ? 'solid' : 'ghost'}
                      justifyContent="flex-start"
                      onClick={() => setActiveTab(3)}
                    >
                      الإعدادات
                    </Button>
                  </Stack>
                  
                  <Divider />
                  
                  <Button
                    leftIcon={<LogOut />}
                    variant="ghost"
                    colorScheme="red"
                    justifyContent="flex-start"
                    onClick={handleLogout}
                  >
                    تسجيل الخروج
                  </Button>
                </Stack>
              </Box>
            )}
            
            {/* Main Content */}
            <Box 
              gridColumn={{ base: '1', lg: '2' }}
              width="100%"
              maxW="100%"
              overflow="hidden"
            >
              <Tabs index={activeTab} onChange={setActiveTab} width="100%" maxW="100%">
                {/* Show tab list only on mobile */}
                {isMobile && (
                  <TabList mb={6} display="flex" flexWrap="wrap" justifyContent="center" width="100%">
                    <Tab>لوحة التحكم</Tab>
                    <Tab>العقارات</Tab>
                    <Tab>العملاء</Tab>
                    <Tab>الإعدادات</Tab>
                  </TabList>
                )}
                
                <TabPanels width="100%" maxW="100%">
                  {/* Dashboard Tab */}
                  <TabPanel px={isMobile ? 0 : 4} width="100%" maxW="100%" overflowX="auto" overflowY="hidden">
                    <Stack spacing={8} minW="max-content">
                      {/* Credits Alert for Mobile */}
                      {isMobile && (
                        <Alert 
                          status="info" 
                          variant="subtle" 
                          flexDirection="column" 
                          alignItems="center" 
                          justifyContent="center" 
                          textAlign="center" 
                          borderRadius="lg"
                          p={4}
                        >
                          <AlertIcon boxSize="24px" mr={0} />
                          <AlertTitle mt={2} mb={1} fontSize="lg">
                            رصيد النقاط
                          </AlertTitle>
                          <AlertDescription maxWidth="sm">
                            لديك {credits} نقطة متبقية. تحتاج إلى {creditCostPerProperty} نقطة لإضافة عقار جديد.
                          </AlertDescription>
                          <Progress 
                            value={(credits / 10) * 100} 
                            size="sm" 
                            colorScheme="green" 
                            width="100%" 
                            mt={3} 
                            borderRadius="full"
                          />
                          <Button 
                            size="sm" 
                            colorScheme="green" 
                            mt={3} 
                            onClick={onBuyCreditsOpen}
                            leftIcon={<Plus />}
                          >
                            شراء نقاط
                          </Button>
                        </Alert>
                      )}
                      
                      
                      <Box
                        bg={bgColor}
                        p={isMobile ? 3 : 6}
                        rounded="xl"
                        boxShadow="xl"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <Stack spacing={6}>
                          <Stack direction="row" justify="space-between" align="center">
                            <Heading size="md">آخر العقارات</Heading>
                            <Tooltip 
                              label={credits < creditCostPerProperty ? "لا يوجد رصيد كافي لإضافة عقار" : "إضافة عقار جديد"} 
                              hasArrow
                            >
                              <Button
                                leftIcon={<Plus />}
                                colorScheme="green"
                                size="md"
                                isDisabled={credits < creditCostPerProperty}
                                onClick={handleAddProperty}
                                px={6}
                                fontWeight="bold"
                                _hover={{
                                  transform: 'translateY(-2px)',
                                  boxShadow: 'lg',
                                }}
                                transition="all 0.2s"
                              >
                                إضافة عقار جديد
                              </Button>
                            </Tooltip>
                          </Stack>
                          
                          {/* Search Input */}
                          <FormControl>
                            <Input
                              placeholder="ابحث عن عقار..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              size="md"
                              borderRadius="md"
                              bg={cardBg}
                              borderColor={borderColor}
                              _hover={{ borderColor: "primary.400" }}
                              _focus={{ borderColor: "primary.500" }}
                            />
                          </FormControl>
                          
                          {isMobile ? (
                            // Mobile view - cards instead of table
                            <VStack align="stretch" spacing={4}>
                              {filteredProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                              ))}
                            </VStack>
                          ) : (
                            // Desktop view - table
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Th>الصورة</Th>
                                  <Th>العقار</Th>
                                  <Th>النوع</Th>
                                  <Th>الحالة</Th>
                                  <Th>السعر</Th>
                                  <Th>المشاهدات</Th>
                                  <Th>الإجراءات</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {filteredProperties.map((property) => (
                                  <Tr key={property.id}>
                                    <Td>
                                      <Image
                                        src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder.jpg'}
                                        alt={property.title}
                                        boxSize="60px"
                                        objectFit="cover"
                                        borderRadius="md"
                                      />
                                    </Td>
                                    <Td>{property.title}</Td>
                                    <Td>
                                      <Badge>
                                        {property.propertyType}
                                      </Badge>
                                    </Td>
                                    <Td>
                                      <Badge colorScheme={getStatusColor(property.status)}>
                                        {property.status}
                                      </Badge>
                                    </Td>
                                    <Td>{property.price} أوقية</Td>
                                    <Td>{property.views}</Td>
                                    <Td>
                                      <HStack spacing={2}>
                                        <IconButton
                                          icon={<Eye />}
                                          size="sm"
                                          variant="ghost"
                                          aria-label="عرض"
                                          onClick={() => handleViewProperty(property)}
                                        />
                                        <IconButton
                                          icon={<Edit2 />}
                                          size="sm"
                                          variant="ghost"
                                          colorScheme="blue"
                                          aria-label="تعديل"
                                          onClick={() => handleEditProperty(property)}
                                        />
                                        {property.status !== 'بيع' && property.status !== 'مؤجر' && (
                                          <Tooltip label="تحديد كمباع">
                                            <IconButton
                                              icon={<Icon as={FaDollarSign} />}
                                              size="sm"
                                              variant="ghost"
                                              colorScheme="green"
                                              aria-label="تحديد كمباع"
                                              onClick={() => {
                                                setSelectedProperty(property);
                                                setIsMarkSoldModalOpen(true);
                                              }}
                                            />
                                          </Tooltip>
                                        )}
                                      </HStack>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </TabPanel>
                  
                  {/* Properties Tab */}
                  <TabPanel px={isMobile ? 0 : 4}>
                    <Stack spacing={6}>
                      <Box
                        bg={bgColor}
                        p={isMobile ? 3 : 6}
                        rounded="xl"
                        boxShadow="xl"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <Stack spacing={6}>
                          <Stack direction="row" justify="space-between" align="center">
                            <Heading size="md">إدارة العقارات</Heading>
                            <Tooltip 
                              label={credits < creditCostPerProperty ? "لا يوجد رصيد كافي لإضافة عقار" : "إضافة عقار جديد"} 
                              hasArrow
                            >
                              <Button
                                leftIcon={<Plus />}
                                colorScheme="green"
                                size="md"
                                isDisabled={credits < creditCostPerProperty}
                                onClick={handleAddProperty}
                                px={6}
                                fontWeight="bold"
                                _hover={{
                                  transform: 'translateY(-2px)',
                                  boxShadow: 'lg',
                                }}
                                transition="all 0.2s"
                              >
                                إضافة عقار جديد
                              </Button>
                            </Tooltip>
                          </Stack>

                          {/* Search Input */}
                          <FormControl>
                            <Input
                              placeholder="ابحث عن عقار..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              size="md"
                              borderRadius="md"
                              bg={cardBg}
                              borderColor={borderColor}
                              _hover={{ borderColor: "primary.400" }}
                              _focus={{ borderColor: "primary.500" }}
                            />
                          </FormControl>
                          
                          {isMobile ? (
                            // Mobile view - cards instead of table
                            <VStack align="stretch" spacing={4}>
                              {filteredProperties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                              ))}
                            </VStack>
                          ) : (
                            // Desktop view - table
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Th>الصورة</Th>
                                  <Th>العقار</Th>
                                  <Th>النوع</Th>
                                  <Th>الحالة</Th>
                                  <Th>السعر</Th>
                                  <Th>المشاهدات</Th>
                                  <Th>الإجراءات</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {filteredProperties.map((property) => (
                                  <Tr key={property.id}>
                                    <Td>
                                      <Image
                                        src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder.jpg'}
                                        alt={property.title}
                                        boxSize="60px"
                                        objectFit="cover"
                                        borderRadius="md"
                                      />
                                    </Td>
                                    <Td>{property.title}</Td>
                                    <Td>
                                      <Badge>
                                        {property.propertyType}
                                      </Badge>
                                    </Td>
                                    <Td>
                                      <Badge colorScheme={getStatusColor(property.status)}>
                                        {property.status}
                                      </Badge>
                                    </Td>
                                    <Td>{property.price} أوقية</Td>
                                    <Td>{property.views}</Td>
                                    <Td>
                                      <HStack spacing={2}>
                                        <IconButton
                                          icon={<Eye />}
                                          size="sm"
                                          variant="ghost"
                                          aria-label="عرض"
                                          onClick={() => handleViewProperty(property)}
                                        />
                                        <IconButton
                                          icon={<Edit2 />}
                                          size="sm"
                                          variant="ghost"
                                          colorScheme="blue"
                                          aria-label="تعديل"
                                          onClick={() => handleEditProperty(property)}
                                        />
                                        {property.status !== 'بيع' && property.status !== 'مؤجر' && (
                                          <Tooltip label="تحديد كمباع">
                                            <IconButton
                                              icon={<Icon as={FaDollarSign} />}
                                              size="sm"
                                              variant="ghost"
                                              colorScheme="green"
                                              aria-label="تحديد كمباع"
                                              onClick={() => {
                                                setSelectedProperty(property);
                                                setIsMarkSoldModalOpen(true);
                                              }}
                                            />
                                          </Tooltip>
                                        )}
                                      </HStack>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          )}
                        </Stack>
                      </Box>
                    </Stack>
                  </TabPanel>
                  
                  {/* Customers Tab */}
                  <TabPanel px={isMobile ? 0 : 4}>
                    <Box
                      bg={bgColor}
                      p={isMobile ? 3 : 6}
                      rounded="xl"
                      boxShadow="xl"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Stack spacing={6}>
                        <Heading size="md">قائمة العملاء</Heading>
                        
                        
                        {isLoading ? (
                          <Center>
                            <Spinner size="xl" color="primary.500" />
                          </Center>
                        ) : error ? (
                          <Alert status="error" variant="subtle" flexDirection="column" alignItems="center" justifyContent="center" textAlign="center" height="200px">
                            <AlertIcon boxSize="40px" mr={0} />
                            <AlertTitle mt={4} mb={1} fontSize="lg">
                              خطأ
                            </AlertTitle>
                            <AlertDescription maxWidth="sm">
                              {error}
                            </AlertDescription>
                          </Alert>
                        ) : customers.length > 0 ? (
                          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                            {customers.map((customer) => (
                              <Box
                                key={customer._id}
                                p={5}
                                shadow="md"
                                borderWidth="1px"
                                borderRadius="lg"
                                bg="white"
                              >
                                <VStack align="start" spacing={4}>
                                  <HStack>
                                    <Icon as={FaUser} color="gray.500" />
                                    <Text fontWeight="bold">{customer.name}</Text>
                                  </HStack>
                                  <HStack>
                                    <Icon as={FaPhone} color="gray.500" />
                                    <Text>{customer.phone}</Text>
                                  </HStack>
                                  <HStack>
                                    <Icon as={FaHome} color="gray.500" />
                                    <Text>
                                      {customer.property ? customer.property.title : 'العقار تم حذفه'}
                                    </Text>
                                  </HStack>
                                  <HStack>
                                    <Icon as={FaMoneyBill} color="gray.500" />
                                    <Text>{customer.agreedPrice ? `${customer.agreedPrice} MRU` : 'لم يتم تحديد السعر'}</Text>
                                  </HStack>
                                  <HStack>
                                    <Icon as={FaCalendar} color="gray.500" />
                                    <Text>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString('fr-FR') : 'لم يتم تحديد التاريخ'}</Text>
                                  </HStack>
                                </VStack>
                              </Box>
                            ))}
                          </SimpleGrid>
                        ) : (
                          <Center>
                            <Text fontSize="lg" color="gray.500">لا يوجد عملاء حالياً</Text>
                          </Center>
                        )}
                      </Stack>
                    </Box>
                  </TabPanel>
                  
                  {/* Settings Tab */}
                  <TabPanel px={isMobile ? 0 : 4} width="100%" maxW="100%" overflow="hidden">
                    <Box
                      bg={bgColor}
                      p={isMobile ? 3 : 6}
                      rounded="xl"
                      boxShadow="xl"
                      borderWidth="1px"
                      borderColor={borderColor}
                      width="100%"
                      maxW="100%"
                    >
                      <Stack spacing={6} width="100%" maxW="100%">
                        <Heading size="md">إعدادات الحساب</Heading>
                        
                        <form onSubmit={(e) => {
                          e.preventDefault();
                          handleSaveSettings();
                        }} style={{ width: '100%', maxWidth: '100%' }}>
                          <VStack spacing={4} width="100%" maxW="100%">
                            <FormControl width="100%" maxW="100%">
                              <FormLabel>الاسم</FormLabel>
                              <Input 
                                value={localSettings.name}
                                onChange={(e) => handleSettingsChange('name', e.target.value)}
                                width="100%"
                                maxW="100%"
                              />
                            </FormControl>
                            
                            <FormControl width="100%" maxW="100%">
                              <FormLabel>البريد الإلكتروني</FormLabel>
                              <Input 
                                type="email" 
                                value={localSettings.email}
                                onChange={(e) => handleSettingsChange('email', e.target.value)}
                                width="100%"
                                maxW="100%"
                              />
                            </FormControl>
                            
                            <FormControl width="100%" maxW="100%">
                              <FormLabel>رقم الهاتف</FormLabel>
                              <Input 
                                value={localSettings.phone}
                                onChange={(e) => handleSettingsChange('phone', e.target.value)}
                                width="100%"
                                maxW="100%"
                              />
                            </FormControl>
                            
                            <FormControl width="100%" maxW="100%">
                              <FormLabel>رقم الواتساب</FormLabel>
                              <Input 
                                value={localSettings.whatsapp}
                                onChange={(e) => handleSettingsChange('whatsapp', e.target.value)}
                                width="100%"
                                maxW="100%"
                              />
                            </FormControl>
                            
                            <Button
                              type="submit"
                              colorScheme="primary"
                              size="lg"
                              w="full"
                              isLoading={isLoading}
                            >
                              حفظ التغييرات
                            </Button>
                          </VStack>
                        </form>
                      </Stack>
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </Grid>
        </MotionBox>

        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Buy Credits Modal */}
        <Modal isOpen={isBuyCreditsOpen} onClose={onBuyCreditsClose} size={isMobile ? "full" : "xl"}>
          <ModalOverlay />
          <ModalContent bg={bgColor}>
            <ModalHeader textAlign="center" fontSize="xl" fontWeight="bold" color={primaryTextBold}>
              شراء نقاط
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6}>
                {/* Credit Price Info Card */}
                <Box 
                  w="100%" 
                  p={5} 
                  bg={primaryBg} 
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={primaryBorder}
                  boxShadow="sm"
                >
                  <VStack spacing={3} align="center">
                    <Text fontWeight="bold" color={primaryText} fontSize="lg">
                      معلومات الشراء
                    </Text>
                    <Text textAlign="center" color={primaryText}>
                      يمكنك شراء نقاط لإضافة المزيد من العقارات. كل عقار يكلف {creditCostPerProperty} نقطة.
                    </Text>
                    <Box 
                      p={3} 
                      bg={cardBg} 
                      borderRadius="md"
                      borderWidth="1px"
                      borderColor={primaryBorder}
                      w="100%"
                    >
                      <Text fontWeight="bold" color={primaryTextBold} textAlign="center">
                        سعر النقطة: {creditPrice} أوقية
                      </Text>
                    </Box>
                  </VStack>
                </Box>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="100%">
                  {/* Credits Selection Card */}
                  <Box 
                    p={5} 
                    bg={cardBg} 
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                    boxShadow="sm"
                  >
                    <VStack spacing={4} align="stretch">
                      <FormControl>
                        <FormLabel fontWeight="bold">عدد النقاط المراد شراؤها</FormLabel>
                        <NumberInput 
                          min={settings?.minPointsToBuy} 
                          max={settings?.maxPointsToBuy} 
                          defaultValue={settings?.minPointsToBuy} 
                          onChange={(value) => setCreditsToBuy(parseInt(value))}
                          size="lg"
                        >
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                        <FormHelperText>
                          الحد الأدنى: {settings?.minPointsToBuy} نقطة | الحد الأقصى: {settings?.maxPointsToBuy} نقطة
                        </FormHelperText>
                      </FormControl>
                      
                      <Box 
                        p={4} 
                        bg={greenBg} 
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={greenBorder}
                      >
                        <HStack justify="space-between">
                          <Text fontWeight="bold">المبلغ الإجمالي:</Text>
                          <Text fontWeight="bold" color={greenTextBold}>
                            {creditsToBuy * creditPrice} أوقية
                          </Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </Box>
                  
                  {/* Payment Method Selection Card */}
                  <Box 
                    p={5} 
                    bg={cardBg} 
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                    boxShadow="sm"
                  >
                    <VStack spacing={4} align="stretch">
                      <FormControl isRequired>
                        <FormLabel>طريقة الدفع</FormLabel>
                        <VStack spacing={4} align="stretch">
                          {settings?.paymentMethods?.filter(method => method.isActive).map((method) => {
                            const bank = BANKS.find(b => b.id === method.bankId);
                            return (
                              <Box
                                key={method.bankId}
                              p={4}
                                borderWidth="1px"
                                borderRadius="lg"
                              cursor="pointer"
                                onClick={() => setSelectedPaymentMethod(method)}
                                bg={selectedPaymentMethod?.bankId === method.bankId ? 'blue.50' : 'white'}
                                borderColor={selectedPaymentMethod?.bankId === method.bankId ? 'blue.500' : 'gray.200'}
                                _hover={{ borderColor: 'blue.500' }}
                              >
                                <HStack spacing={4}>
                                <Image 
                                    src={method.image || bank?.image || '/images/banks/default.png'}
                                    alt={bank?.name}
                                  boxSize="40px" 
                                  objectFit="contain" 
                                />
                                  <VStack align="start" spacing={1}>
                                    <Text fontWeight="bold">{bank?.name}</Text>
                                    <Text fontSize="sm" color="gray.600">
                                      {method.accountName}
                                    </Text>
                                    <Text fontSize="sm" color="gray.600">
                                      {method.accountNumber}
                                    </Text>
                                  </VStack>
                              </HStack>
                            </Box>
                            );
                          })}
                        </VStack>
                      </FormControl>
                    </VStack>
                  </Box>
                </SimpleGrid>
                
                {/* Payment Account Details Card */}
                {selectedPaymentMethod && (
                  <Box 
                    w="100%" 
                    p={5} 
                    bg={cardBg} 
                    borderRadius="lg"
                    borderWidth="1px"
                    borderColor={borderColor}
                    boxShadow="sm"
                  >
                    <VStack spacing={4} align="stretch">
                      <Text fontWeight="bold" fontSize="lg" textAlign="center">
                        تفاصيل الحساب
                      </Text>
                      
                      <Box 
                        p={4} 
                        bg={blueBg} 
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={blueBorder}
                      >
                        <VStack spacing={3} align="stretch">
                          <HStack justify="space-between">
                            <Text fontWeight="medium">اسم الحساب:</Text>
                            <Text fontWeight="bold">
                              {selectedPaymentMethod.accountName}
                            </Text>
                          </HStack>
                          <HStack justify="space-between">
                            <Text fontWeight="medium">رقم الحساب:</Text>
                            <HStack>
                              <Text fontWeight="bold">
                                {selectedPaymentMethod.accountNumber}
                              </Text>
                              <IconButton
                                icon={<Copy />}
                                size="sm"
                                colorScheme="blue"
                                variant="ghost"
                                onClick={() => {
                                  navigator.clipboard.writeText(selectedPaymentMethod.accountNumber);
                                  toast({
                                    title: "تم نسخ رقم الحساب",
                                    status: "success",
                                    duration: 2000,
                                  });
                                }}
                                aria-label="نسخ رقم الحساب"
                              />
                            </HStack>
                          </HStack>
                          {selectedPaymentMethod.instructions && (
                            <Box mt={2}>
                              <Text color="gray.600" fontSize="sm">
                                {selectedPaymentMethod.instructions}
                              </Text>
                            </Box>
                          )}
                        </VStack>
                      </Box>
                      
                      <Text textAlign="center" color={mutedTextColor}>
                        قم بتحويل المبلغ المطلوب ({creditsToBuy * creditPrice} أوقية) إلى الحساب أعلاه
                      </Text>
                    </VStack>
                  </Box>
                )}
                
                {/* Screenshot Upload Card */}
                <Box 
                  w="100%" 
                  p={5} 
                  bg={cardBg} 
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  boxShadow="sm"
                >
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel fontWeight="bold">صورة إثبات الدفع</FormLabel>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleScreenshotChange}
                        p={2}
                        borderWidth="2px"
                        borderColor={borderColor}
                        borderRadius="md"
                        _hover={{ borderColor: "primary.400" }}
                        _focus={{ borderColor: "primary.500" }}
                      />
                    </FormControl>
                    
                    {paymentScreenshotPreview && (
                      <Box 
                        mt={2} 
                        borderRadius="md" 
                        overflow="hidden"
                        borderWidth="1px"
                        borderColor={borderColor}
                        p={3}
                      >
                        <Text mb={2} fontWeight="medium">معاينة الصورة:</Text>
                        <Image 
                          src={paymentScreenshotPreview} 
                          alt="إثبات الدفع" 
                          maxH="200px" 
                          objectFit="contain"
                          mx="auto"
                        />
                      </Box>
                    )}
                  </VStack>
                </Box>
                
                {/* Warning Alert */}
                <Box 
                  w="100%" 
                  p={4} 
                  bg={yellowBg} 
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={yellowBorder}
                >
                  <Alert status="warning" variant="subtle" bg="transparent">
                    <AlertIcon color="yellow.500" boxSize="20px" />
                    <Text fontWeight="medium" color={yellowText}>
                      بعد رفع صورة إثبات الدفع، سيتم مراجعة طلبك من قبل الإدارة. قد تستغرق العملية حتى 24 ساعة.
                    </Text>
                  </Alert>
                </Box>
                
                {/* Submit Button */}
                <Button 
                  colorScheme="blue"
                  size="lg" 
                  width="100%"
                  onClick={handleBuyCredits}
                  isLoading={isLoading}
                  isDisabled={!selectedPaymentMethod || !paymentScreenshot || 
                    creditsToBuy < settings?.minPointsToBuy || 
                    creditsToBuy > settings?.maxPointsToBuy}
                >
                  تأكيد الشراء
                </Button>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onBuyCreditsClose}>
                إلغاء
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Payment Submitted Modal */}
        <Modal isOpen={isPaymentSubmittedOpen} onClose={onPaymentSubmittedClose} size={isMobile ? "full" : "md"}>
          <ModalOverlay />
          <ModalContent bg={bgColor}>
            <ModalHeader textAlign="center" fontSize="xl" fontWeight="bold" color={greenTextBold}>
              تم استلام طلب الشراء
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6} align="center">
                <Box 
                  p={4} 
                  bg={greenBg} 
                  borderRadius="full"
                  borderWidth="1px"
                  borderColor={greenBorder}
                >
                  <Alert status="success" variant="subtle" bg="transparent" borderRadius="full">
                    <AlertIcon boxSize="40px" color="green.500" />
                  </Alert>
                </Box>
                
                <Text fontSize="lg" fontWeight="bold" textAlign="center">
                  شكراً لك على طلب شراء النقاط
                </Text>
                
                <Box 
                  p={4} 
                  bg={cardBg} 
                  borderRadius="lg"
                  borderWidth="1px"
                  borderColor={borderColor}
                  w="100%"
                >
                  <VStack spacing={2} align="stretch">
                    <HStack justify="space-between">
                      <Text fontWeight="medium">عدد النقاط:</Text>
                      <Text fontWeight="bold">{creditsToBuy} نقطة</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">المبلغ المدفوع:</Text>
                      <Text fontWeight="bold">{creditsToBuy * creditPrice} أوقية</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontWeight="medium">طريقة الدفع:</Text>
                      <Text fontWeight="bold">
                        {paymentMethods?.find(m => m.id === selectedPaymentMethod)?.name || ''}
                      </Text>
                    </HStack>
                  </VStack>
                </Box>
                
                <Text textAlign="center">
                  تم استلام طلبك. سيتم مراجعة طلبك من قبل الإدارة خلال 24 ساعة.
                </Text>
                
                <Text textAlign="center" color={mutedTextColor}>
                  سيتم إشعارك عند اكتمال عملية المراجعة وإضافة النقاط إلى حسابك.
                </Text>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button 
                colorScheme="green" 
                size="lg" 
                onClick={onPaymentSubmittedClose}
                w="100%"
              >
                إغلاق
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Add Property Modal */}
        <Modal isOpen={isAddPropertyOpen} onClose={onAddPropertyClose} size={isMobile ? "full" : "xl"}>
          <ModalOverlay />
          <ModalContent bg={bgColor}>
            <ModalHeader>إضافة عقار جديد</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>رصيد النقاط</AlertTitle>
                    <AlertDescription>
                      سيتم خصم {creditCostPerProperty} نقطة من رصيدك البالغ {credits} نقطة
                    </AlertDescription>
                  </Box>
                </Alert>

                {/* Upload Progress Bar */}
                {isUploading && (
                  <Box w="100%" p={4} bg="blue.50" borderRadius="md" borderWidth="1px" borderColor="blue.200">
                    <VStack spacing={3}>
                      <Text fontWeight="bold" color="blue.700">{uploadStatus}</Text>
                      <Progress 
                        value={uploadProgress} 
                        size="lg" 
                        colorScheme="blue" 
                        width="100%" 
                        borderRadius="full"
                      />
                      <Text fontSize="sm" color="blue.600">
                        {uploadProgress}% مكتمل
                      </Text>
                    </VStack>
                  </Box>
                )}

                {/* File Size Warning */}
                <Alert status="warning" borderRadius="md">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>ملاحظة مهمة</AlertTitle>
                    <AlertDescription>
                      يمكنك رفع ملفات فيديو كبيرة حتى 100 ميجابايت (1-2 دقائق). قد يستغرق الرفع وقتاً أطول للملفات الكبيرة.
                    </AlertDescription>
                  </Box>
                </Alert>
                
                <FormControl isRequired>
                  <FormLabel>نوع العقار</FormLabel>
                  <Select
                    placeholder="اختر نوع العقار"
                    value={newProperty.type}
                    onChange={(e) => setNewProperty({ ...newProperty, type: e.target.value })}
                  >
                    <option value="أرض للبيع">أرض للبيع</option>
                    <option value="منزل للبيع">منزل للبيع</option>
                    <option value="منزل للايجار">منزل للايجار</option>
                    <option value="شقة للايجار">شقة للايجار</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>العنوان</FormLabel>
                  <Input placeholder="أدخل عنوان العقار" value={newProperty.title} onChange={(e) => setNewProperty({ ...newProperty, title: e.target.value })} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>الوصف</FormLabel>
                  <Textarea placeholder="أدخل وصف العقار" value={newProperty.description} onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })} />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>الموقع</FormLabel>
                  <Input placeholder="أدخل موقع العقار" value={newProperty.location} onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })} />
                </FormControl>

                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
                  <FormControl isRequired>
                    <FormLabel>المحافظة</FormLabel>
                    <Select
                      value={newProperty.province}
                      onChange={handleProvinceChange}
                      placeholder="اختر المحافظة"
                    >
                      {Object.keys(provinceDistricts).map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>المقاطعة</FormLabel>
                    <Select
                      value={newProperty.district}
                      onChange={(e) => setNewProperty({ ...newProperty, district: e.target.value })}
                      placeholder="اختر المقاطعة"
                      isDisabled={!newProperty.province}
                    >
                      {newProperty.province && provinceDistricts[newProperty.province]?.map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired>
                  <FormLabel>السعر (أوقية)</FormLabel>
                  <NumberInput min={0} value={newProperty.price} onChange={(value) => setNewProperty({ ...newProperty, price: value })}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>المساحة (متر مربع)</FormLabel>
                  <NumberInput min={0} value={newProperty.area} onChange={(value) => setNewProperty({ ...newProperty, area: value })}>
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                

                <FormControl isRequired>
                  <FormLabel>المميزات</FormLabel>
                  <VStack spacing={2} align="stretch">
                    {newProperty.features.map((feature, index) => (
                      <HStack key={index}>
                        <Input
                          value={feature}
                          onChange={(e) => {
                            const newFeatures = [...newProperty.features];
                            newFeatures[index] = e.target.value;
                            setNewProperty({ ...newProperty, features: newFeatures });
                          }}
                          placeholder="أدخل ميزة"
                        />
                        <IconButton
                          icon={<X />}
                          colorScheme="red"
                          variant="ghost"
                          onClick={() => {
                            const newFeatures = newProperty.features.filter((_, i) => i !== index);
                            setNewProperty({ ...newProperty, features: newFeatures });
                          }}
                        />
                      </HStack>
                    ))}
                    <Button
                      leftIcon={<Plus />}
                      onClick={() => setNewProperty({ ...newProperty, features: [...newProperty.features, ''] })}
                      size="sm"
                      colorScheme="green"
                    >
                      إضافة ميزة
                    </Button>
                  </VStack>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>الصور والفيديوهات</FormLabel>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text mb={2}>الصورة الرئيسية</Text>
                  <Input
                    type="file"
                    accept="image/*"
                        onChange={handleMainPhotoUpload}
                        p={1}
                      />
                      {mainPhotoPreview && (
                        <Image
                          src={mainPhotoPreview}
                          alt="Main property"
                          mt={2}
                          maxH="200px"
                          objectFit="cover"
                        />
                      )}
                    </Box>
                    <Box>
                      <Text mb={2}>صور وفيديوهات إضافية (حتى 100 ميجابايت لكل ملف)</Text>
                      <Input
                        type="file"
                        accept="image/*,video/*"
                    multiple
                        onChange={handleAdditionalMediaUpload}
                        p={1}
                      />
                      <Text fontSize="sm" color="gray.600" mt={1}>
                        يمكنك رفع ملفات فيديو طويلة (1-2 دقائق) وملفات صور عالية الجودة
                      </Text>
                      <SimpleGrid columns={3} spacing={2} mt={2}>
                        {additionalMediaPreviews.map((preview, index) => (
                          <Box key={index} position="relative">
                            {preview.type === 'image' ? (
                              <Image
                                src={preview.url}
                                alt={`Additional ${index + 1}`}
                                maxH="100px"
                                objectFit="cover"
                              />
                            ) : (
                              <video
                                src={preview.url}
                                controls
                                style={{ maxHeight: '100px', width: '100%' }}
                              />
                            )}
                            <IconButton
                              icon={<X />}
                              size="sm"
                              colorScheme="red"
                              position="absolute"
                              top={1}
                              right={1}
                              onClick={() => handleRemoveMedia(index)}
                            />
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Box>
                  </VStack>
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onAddPropertyClose} isDisabled={isUploading}>
                إلغاء
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handleSaveNewProperty}
                isLoading={isUploading}
                loadingText="جاري الرفع..."
                isDisabled={isUploading}
              >
                حفظ
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Insufficient Credits Alert Dialog */}
        <AlertDialog
          isOpen={isInsufficientCreditsOpen}
          leastDestructiveRef={cancelRef}
          onClose={onInsufficientCreditsClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent bg={bgColor}>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                رصيد غير كافي
              </AlertDialogHeader>

              <AlertDialogBody>
                لا يوجد لديك رصيد كافي لإضافة عقار جديد. تحتاج إلى {creditCostPerProperty} نقطة، ورصيدك الحالي {credits} نقطة.
                يرجى التواصل مع الإدارة لإضافة المزيد من النقاط إلى حسابك.
              </AlertDialogBody>

              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onInsufficientCreditsClose}>
                  إغلاق
                </Button>
                <Button colorScheme="blue" onClick={onBuyCreditsOpen} mr={3}>
                  شراء نقاط
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        {/* View Property Modal */}
        <Modal isOpen={isViewOpen} onClose={onViewClose} size={isMobile ? "full" : "xl"}>
          <ModalOverlay />
          <ModalContent bg={bgColor}>
            <ModalHeader>تفاصيل العقار</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedProperty && (
                <VStack spacing={6} align="stretch">
                  <Box>
                    <Text fontWeight="bold">العنوان:</Text>
                    <Text>{selectedProperty.title}</Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">الموقع:</Text>
                    <Text>{selectedProperty.location}</Text>
                  </Box>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                    <Box>
                      <Text fontWeight="bold">النوع:</Text>
                      <Badge>
                        {selectedProperty.propertyType}
                      </Badge>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold">الحالة:</Text>
                      <Badge colorScheme={getStatusColor(selectedProperty.status)}>
                        {selectedProperty.status}
                      </Badge>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold">السعر:</Text>
                      <Text>{selectedProperty.price} أوقية</Text>
                    </Box>
                    
                    <Box>
                      <Text fontWeight="bold">المشاهدات:</Text>
                      <Text>{selectedProperty.views}</Text>
                    </Box>
                    
                    
                  </SimpleGrid>
                  {selectedProperty.features && selectedProperty.features.length > 0 && (
                    <Box>
                      <Text fontWeight="bold" mb={2}>المميزات:</Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={2}>
                        {selectedProperty.features.map((feature, index) => (
                          <Box 
                            key={index} 
                            p={2} 
                            bg={primaryBg} 
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={primaryBorder}
                          >
                            <Text>{feature}</Text>
                          </Box>
                        ))}
                      </SimpleGrid>
                    </Box>
                  )}

                  {/* Media Section */}
                  <Box>
                    <Text fontWeight="bold" mb={4}>الصور والفيديوهات</Text>
                    <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                      {selectedProperty.images?.map((image, index) => {
                        const isVideo = image.endsWith('.mp4');
                        const thumbnailUrl = isVideo ? image.replace('.mp4', '.jpg') : image;
                        
                        return (
                        <Box
                          key={index}
                          position="relative"
                          cursor="pointer"
                            onClick={() => {
                              if (isVideo) {
                                window.open(image, '_blank');
                              } else {
                                window.open(image, '_blank');
                              }
                            }}
                          >
                            <Box
                              position="relative"
                              w="100%"
                              h="200px"
                              borderRadius="md"
                              overflow="hidden"
                              transition="transform 0.2s"
                              _hover={{ transform: 'scale(1.02)' }}
                            >
                              <Image
                                src={thumbnailUrl}
                                alt={isVideo ? `فيديو ${index + 1}` : `صورة ${index + 1}`}
                                w="100%"
                                h="100%"
                                objectFit="cover"
                              />
                              {isVideo && (
                                <Box
                                  position="absolute"
                                  top="50%"
                                  left="50%"
                                  transform="translate(-50%, -50%)"
                                  bg="blackAlpha.700"
                                  borderRadius="full"
                                  p={2}
                                >
                                  <Play size={24} color="white" />
                            </Box>
                          )}
                        </Box>
                          </Box>
                        );
                      })}
                    </SimpleGrid>
                  </Box>

                  {/* In the View Property Modal */}
                  <Box>
                    <Text fontWeight="bold">المساحة:</Text>
                    <Text>{selectedProperty.area} متر مربع</Text>
                  </Box>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={onViewClose}>
                إغلاق
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Property Modal */}
        <Modal isOpen={isEditOpen} onClose={onEditClose} size={isMobile ? "full" : "xl"}>
          <ModalOverlay />
          <ModalContent bg={bgColor}>
            <ModalHeader>تعديل العقار</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedProperty && (
                <VStack spacing={4}>
                  <FormControl>
                    <FormLabel>العنوان</FormLabel>
                    <Input 
                      value={selectedProperty.title} 
                      onChange={(e) => setSelectedProperty({...selectedProperty, title: e.target.value})}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>النوع</FormLabel>
                    <Select 
                      value={selectedProperty.propertyType}
                      onChange={(e) => setSelectedProperty({...selectedProperty, propertyType: e.target.value})}
                    >
                      <option value="أرض للبيع">أرض للبيع</option>
                      <option value="منزل للبيع">منزل للبيع</option>
                      <option value="منزل للايجار">منزل للايجار</option>
                      <option value="شقة للايجار">شقة للايجار</option>
                    </Select>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>الحالة</FormLabel>
                    <Select 
                      value={selectedProperty.status}
                      onChange={(e) => setSelectedProperty({...selectedProperty, status: e.target.value})}
                    >
                      <option value="للبيع">للبيع</option>
                      <option value="بيع">بيع</option>
                      <option value="للايجار">للايجار</option>
                      <option value="مؤجر">مؤجر</option>
                    </Select>
                  </FormControl>
                  
                  {/* <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
                    <FormControl>
                      <FormLabel>عدد غرف النوم</FormLabel>
                      <NumberInput 
                        min={0} 
                        value={selectedProperty.bedrooms}
                        onChange={(value) => setSelectedProperty({...selectedProperty, bedrooms: value})}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                    
                    <FormControl>
                      <FormLabel>عدد الحمامات</FormLabel>
                      <NumberInput 
                        min={0} 
                        value={selectedProperty.bathrooms}
                        onChange={(value) => setSelectedProperty({...selectedProperty, bathrooms: value})}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    </FormControl>
                  </SimpleGrid> */}
                  
                  <FormControl>
                    <FormLabel>السعر</FormLabel>
                    <NumberInput 
                      min={0} 
                      value={selectedProperty.price}
                      onChange={(value) => setSelectedProperty({...selectedProperty, price: value})}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>الوصف</FormLabel>
                    <Textarea 
                      value={selectedProperty.description}
                      onChange={(e) => setSelectedProperty({...selectedProperty, description: e.target.value})}
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>المميزات</FormLabel>
                    <VStack spacing={2} align="stretch">
                      {selectedProperty.features?.map((feature, index) => (
                        <HStack key={index}>
                          <Input
                            value={feature}
                            onChange={(e) => {
                              const newFeatures = [...selectedProperty.features];
                              newFeatures[index] = e.target.value;
                              setSelectedProperty({...selectedProperty, features: newFeatures});
                            }}
                            placeholder="أدخل ميزة"
                          />
                          <IconButton
                            icon={<X />}
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => {
                              const newFeatures = selectedProperty.features.filter((_, i) => i !== index);
                              setSelectedProperty({...selectedProperty, features: newFeatures});
                            }}
                          />
                        </HStack>
                      ))}
                      <Button
                        leftIcon={<Plus />}
                        onClick={() => {
                          setSelectedProperty({ 
                            ...selectedProperty, 
                            features: [...(selectedProperty.features || []), ''] 
                          });
                        }}
                        size="sm"
                        colorScheme="green"
                      >
                        إضافة ميزة
                      </Button>
                    </VStack>
                  </FormControl>
                  
                  <Divider />
                  
                  {/* Main Photo Section */}
                  <FormControl>
                    <FormLabel>الصورة الرئيسية</FormLabel>
                    {selectedProperty.mainPhoto ? (
                      <Box position="relative">
                        <Image
                          src={selectedProperty.mainPhoto instanceof File ? 
                            URL.createObjectURL(selectedProperty.mainPhoto) : 
                            selectedProperty.mainPhoto}
                          alt="الصورة الرئيسية"
                          borderRadius="md"
                          w="100%"
                          h="200px"
                          objectFit="cover"
                        />
                        <IconButton
                          icon={<Edit2 />}
                          position="absolute"
                          top={2}
                          right={2}
                          colorScheme="blue"
                          onClick={() => document.getElementById('editMainPhotoInput').click()}
                        />
                        <Input
                          type="file"
                          id="editMainPhotoInput"
                          accept="image/*"
                          display="none"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setSelectedProperty({...selectedProperty, mainPhoto: file});
                            }
                          }}
                        />
                      </Box>
                    ) : (
                      <Box
                        borderWidth="2px"
                        borderStyle="dashed"
                        borderColor={borderColor}
                        borderRadius="md"
                        p={4}
                        textAlign="center"
                        cursor="pointer"
                        _hover={{ borderColor: "primary.500" }}
                        onClick={() => document.getElementById('editMainPhotoInput').click()}
                      >
                        <Input
                          type="file"
                          id="editMainPhotoInput"
                          accept="image/*"
                          display="none"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              setSelectedProperty({...selectedProperty, mainPhoto: file});
                            }
                          }}
                        />
                        <VStack spacing={2}>
                          <Upload size={24} />
                          <Text>اختر الصورة الرئيسية</Text>
                        </VStack>
                      </Box>
                    )}
                  </FormControl>
                  
                  {/* Additional Media Section */}
                  <FormControl>
                    <FormLabel>الوسائط الإضافية</FormLabel>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={4}>
                      {selectedProperty.additionalMedia?.map((media, index) => {
                        const isVideo = typeof media === 'string' && media.endsWith('.mp4');
                        const thumbnailUrl = isVideo ? media.replace('.mp4', '.jpg') : media;
                        
                        return (
                        <Box key={index} position="relative">
                            {media instanceof File ? (
                              isVideo ? (
                                <Box
                                  position="relative"
                                  w="100%"
                                  h="100px"
                                  bg="black"
                                  borderRadius="md"
                                  overflow="hidden"
                                >
                                  <video
                                    src={URL.createObjectURL(media)}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                  />
                                  <Box
                                    position="absolute"
                                    top="50%"
                                    left="50%"
                                    transform="translate(-50%, -50%)"
                                    bg="blackAlpha.700"
                                    borderRadius="full"
                                    p={2}
                                  >
                                    <Play size={24} color="white" />
                                  </Box>
                                </Box>
                              ) : (
                            <Image
                                  src={URL.createObjectURL(media)}
                              alt={`صورة ${index + 1}`}
                              borderRadius="md"
                              w="100%"
                              h="100px"
                              objectFit="cover"
                            />
                              )
                          ) : (
                              isVideo ? (
                            <Box
                                  position="relative"
                              w="100%"
                              h="100px"
                                  bg="black"
                                  borderRadius="md"
                                  overflow="hidden"
                                >
                                  <Image
                                    src={thumbnailUrl}
                                    alt={`فيديو ${index + 1}`}
                                    w="100%"
                                    h="100%"
                                    objectFit="cover"
                                  />
                                  <Box
                                    position="absolute"
                                    top="50%"
                                    left="50%"
                                    transform="translate(-50%, -50%)"
                                    bg="blackAlpha.700"
                                    borderRadius="full"
                                    p={2}
                                  >
                                    <Play size={24} color="white" />
                            </Box>
                                </Box>
                              ) : (
                                <Image
                                  src={media}
                                  alt={`صورة ${index + 1}`}
                                  borderRadius="md"
                                  w="100%"
                                  h="100px"
                                  objectFit="cover"
                                />
                              )
                            )}
                            <IconButton
                              icon={<X />}
                              size="sm"
                              colorScheme="red"
                              position="absolute"
                              top={1}
                              right={1}
                              onClick={() => {
                                const newMedia = selectedProperty.additionalMedia.filter((_, i) => i !== index);
                                setSelectedProperty({...selectedProperty, additionalMedia: newMedia});
                              }}
                            />
                        </Box>
                        );
                      })}
                      <Box
                        borderWidth="2px"
                        borderStyle="dashed"
                        borderColor={borderColor}
                        borderRadius="md"
                        p={4}
                        textAlign="center"
                        cursor="pointer"
                        _hover={{ borderColor: "primary.500" }}
                        onClick={() => document.getElementById('editAdditionalMediaInput').click()}
                      >
                        <Input
                          type="file"
                          id="editAdditionalMediaInput"
                          accept="image/*,video/*"
                          multiple
                          display="none"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            if (files.length > 0) {
                              setSelectedProperty({
                                ...selectedProperty,
                                additionalMedia: [...selectedProperty.additionalMedia, ...files]
                              });
                            }
                          }}
                        />
                        <VStack spacing={2}>
                          <Upload size={24} />
                          <Text>إضافة وسائط</Text>
                        </VStack>
                      </Box>
                    </SimpleGrid>
                  </FormControl>

                  <FormControl>
                    <FormLabel>المساحة (متر مربع)</FormLabel>
                    <NumberInput 
                      min={0} 
                      value={selectedProperty.area}
                      onChange={(value) => setSelectedProperty({...selectedProperty, area: value})}
                    >
                      <NumberInputField />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </VStack>
              )}
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onEditClose}>
                إلغاء
              </Button>
              <Button 
                colorScheme="blue" 
                onClick={handleSaveEdit}
                isLoading={isLoading}
              >
                حفظ التغييرات
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Media Viewer Modal */}
        <Modal isOpen={isMediaViewerOpen} onClose={() => setIsMediaViewerOpen(false)} size="6xl">
          <ModalOverlay />
          <ModalContent bg={bgColor}>
            <ModalHeader>وسائط العقار - {selectedMedia?.title}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={6}>
                {/* Images Section */}
                <Box w="100%">
                  <Text fontWeight="bold" mb={4}>الصور</Text>
                  <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={4}>
                    {selectedMedia?.media
                      .filter(item => item.type === 'image')
                      .map((item, index) => (
                        <Box
                          key={index}
                          position="relative"
                          cursor="pointer"
                          onClick={() => window.open(item.url, '_blank')}
                        >
                          <Image
                            src={item.url}
                            alt={`صورة ${index + 1}`}
                            w="100%"
                            h="200px"
                            objectFit="cover"
                            borderRadius="md"
                            transition="transform 0.2s"
                            _hover={{ transform: 'scale(1.02)' }}
                          />
                        </Box>
                      ))}
                  </SimpleGrid>
                </Box>

                {/* Videos Section */}
                {selectedMedia?.media.some(item => item.type === 'video') && (
                  <Box w="100%">
                    <Text fontWeight="bold" mb={4}>الفيديوهات</Text>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      {selectedMedia?.media
                        .filter(item => item.type === 'video')
                        .map((item, index) => (
                          <Box key={index} position="relative">
                            <video
                              controls
                              width="100%"
                              style={{ borderRadius: '8px' }}
                            >
                              <source src={item.url} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </Box>
                        ))}
                    </SimpleGrid>
                  </Box>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setIsMediaViewerOpen(false)}>إغلاق</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Mark as Sold/Rented Modal */}
        <Modal isOpen={isMarkSoldModalOpen} onClose={() => setIsMarkSoldModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedProperty?.status === 'للايجار' ? 'تسجيل عملية التأجير' : 'تسجيل عملية البيع'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <Box w="100%" p={4} bg="gray.50" borderRadius="md">
                  <Text fontWeight="bold">تفاصيل العقار</Text>
                  <Text>العنوان: {selectedProperty?.title}</Text>
                  <Text>السعر: {selectedProperty?.price?.toLocaleString('ar-SA')} MRU</Text>
                </Box>
                <FormControl isRequired>
                  <FormLabel>
                    {selectedProperty?.status === 'للايجار' ? 'اسم المستأجر' : 'اسم المشتري'}
                  </FormLabel>
                  <Input
                    value={saleDetails.customerName}
                    onChange={(e) => setSaleDetails({ ...saleDetails, customerName: e.target.value })}
                    placeholder={`أدخل اسم ${selectedProperty?.status === 'للايجار' ? 'المستأجر' : 'المشتري'}`}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>
                    {selectedProperty?.status === 'للايجار' ? 'رقم هاتف المستأجر' : 'رقم هاتف المشتري'}
                  </FormLabel>
                  <Input
                    value={saleDetails.customerPhone}
                    onChange={(e) => setSaleDetails({ ...saleDetails, customerPhone: e.target.value })}
                    placeholder="أدخل رقم الهاتف"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>
                    {selectedProperty?.status === 'للايجار' ? 'قيمة الإيجار المتفق عليها' : 'سعر البيع المتفق عليه'}
                  </FormLabel>
                  <Input
                    type="number"
                    value={saleDetails.agreedPrice}
                    onChange={(e) => setSaleDetails({ ...saleDetails, agreedPrice: e.target.value })}
                    placeholder={`أدخل ${selectedProperty?.status === 'للايجار' ? 'قيمة الإيجار' : 'سعر البيع'}`}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={handleMarkSold}>
                {selectedProperty?.status === 'للايجار' ? 'تأكيد التأجير' : 'تأكيد البيع'}
              </Button>
              <Button variant="ghost" onClick={() => setIsMarkSoldModalOpen(false)}>
                إلغاء
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Points Display */}
        <Box p={4} bg="white" borderRadius="lg" shadow="sm">
          <Stack spacing={4}>
            <Flex justify="space-between" align="center">
              <Text fontSize="lg" fontWeight="bold">رصيد النقاط</Text>
              <Button
                colorScheme="blue"
                size="sm"
                leftIcon={<Plus />}
                onClick={onBuyCreditsOpen}
              >
                شراء نقاط
              </Button>
            </Flex>
            <Stat>
              <StatNumber fontSize="3xl">{credits}</StatNumber>
              <StatHelpText>
                نقطة متبقية
              </StatHelpText>
            </Stat>
            <Progress
              value={(credits / settings?.pointsPerProperty) * 100}
              colorScheme={credits >= settings?.pointsPerProperty ? "green" : "red"}
            />
            <Text fontSize="sm" color="gray.600">
              لديك {credits} نقطة متبقية. تحتاج إلى {settings?.pointsPerProperty} نقطة لإضافة عقار جديد.
            </Text>
          </Stack>
        </Box>

        {/* Points Transactions */}
        <Box p={4} bg="white" borderRadius="lg" shadow="sm" mt={4}>
          <Stack spacing={4}>
            <Text fontSize="lg" fontWeight="bold">سجل النقاط</Text>
            {isLoading ? (
              <Center p={4}>
                <Spinner />
              </Center>
            ) : pointsTransactions.length > 0 ? (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>التاريخ</Th>
                    <Th>النوع</Th>
                    <Th>النقاط</Th>
                    <Th>الحالة</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pointsTransactions.map((transaction) => (
                    <Tr key={transaction._id}>
                      <Td>{new Date(transaction.createdAt).toLocaleDateString('fr-FR')}</Td>
                      <Td>
                        {transaction.type === 'points_purchase' ? 'شراء نقاط' : 'إضافة عقار'}
                      </Td>
                      <Td>
                        {transaction.type === 'points_purchase' ? (
                          <Text color="green.500">+{transaction.points}</Text>
                        ) : (
                          <Text color="red.500">-{transaction.points}</Text>
                        )}
                      </Td>
                      <Td>
                        <Badge colorScheme={transaction.status === 'completed' ? 'green' : 'yellow'}>
                          {transaction.status === 'completed' ? 'مكتمل' : 'معلق'}
                        </Badge>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            ) : (
              <Text textAlign="center" color="gray.500">لا يوجد معاملات حتى الآن</Text>
            )}
          </Stack>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default SellerDashboard; 