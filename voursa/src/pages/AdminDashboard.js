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
  Select,
  VStack,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Divider,
  Switch,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  Image,
  TableContainer,
  Icon,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Flex,
  useBreakpointValue,
  FormHelperText,
  IconButton as ChakraIconButton,
  IconButtonProps,
  useMediaQuery,
  useBreakpoint,
  useDisclosureProps,
  useMediaQueryProps,
  useMediaQueryOptions,
  useMediaQueryResult,
  useMediaQueryState,
  useMediaQueryStateProps,
  useMediaQueryStateResult,
  useMediaQueryStateOptions,
  useMediaQueryStateOptionsProps,
  useMediaQueryStateOptionsResult,
  useMediaQueryStateOptionsPropsResult,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  ButtonGroup,
  Textarea,
  List,
  ListItem,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  InputRightAddon,
  InputLeftAddon,
  Search2Icon,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Home,
  Users,
  Building2,
  Settings,
  LogOut,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  Ban,
  UserPlus,
  DollarSign,
  BarChart2,
  MessageSquare,
  Plus,
  X,
  Menu as MenuIcon,
  User,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import PropertyMediaSlider from '../components/PropertyMediaSlider';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';

const MotionBox = motion(Box);

// Mock data - In a real app, this would come from an API



const mockPaymentMethods = [
  {
    id: 'bankily',
    name: 'بنكلي',
    accountNumber: '12345678',
    accountName: 'شركة فورصة',
    isActive: true
  },
  {
    id: 'masrivi',
    name: 'المصرفي',
    accountNumber: '87654321',
    accountName: 'شركة فورصة',
    isActive: true
  },
  {
    id: 'sedad',
    name: 'سداد',
    accountNumber: '11223344',
    accountName: 'شركة فورصة',
    isActive: true
  },
  {
    id: 'click',
    name: 'كليك',
    accountNumber: '44332211',
    accountName: 'شركة فورصة',
    isActive: true
  },
  {
    id: 'bimbank',
    name: 'بنك بيم',
    accountNumber: '99887766',
    accountName: 'شركة فورصة',
    isActive: true
  }
];

// Add this after the mockTransactions array
const staticBanks = [
  { id: 'bankily', name: 'بنكلي', image: '/bankily.png' },
  { id: 'masrivi', name: 'المصرفي', image: '/masrivi.png' },
  { id: 'sedad', name: 'سداد', image: '/sedad.png' },
  { id: 'click', name: 'كليك', image: '/click.png' },
  { id: 'bimbank', name: 'بنك بيم', image: '/bimbank.png' }
];

// Add Cloudinary upload function
const uploadToCloudinary = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/upload/cloudinary`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const { user, logout, addUser, updateUser, deleteUser, getUsers } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [pointsToAdd, setPointsToAdd] = useState(100);
  
  const { isOpen: isViewTransactionOpen, onOpen: onViewTransactionOpen, onClose: onViewTransactionClose } = useDisclosure();
  const { isOpen: isApproveTransactionOpen, onOpen: onApproveTransactionOpen, onClose: onApproveTransactionClose } = useDisclosure();
  const { isOpen: isRejectTransactionOpen, onOpen: onRejectTransactionOpen, onClose: onRejectTransactionClose } = useDisclosure();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  
  const { isOpen: isMobileMenuOpen, onOpen: onMobileMenuOpen, onClose: onMobileMenuClose } = useDisclosure();
  
  const isMobile = useBreakpointValue({ base: true, md: false });
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const cardBorderColor = useColorModeValue('gray.200', 'gray.700');
  const headerBgColor = useColorModeValue('white', 'gray.800');
  const headerBorderColor = useColorModeValue('gray.200', 'gray.700');
  
  const { settings, updateSettings } = useSettings();
  
  // Add local state for settings
  const [localSettings, setLocalSettings] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    pointCost: 0,
    pointsPerProperty: 0,
    minPointsToBuy: 0,
    maxPointsToBuy: 0,
    paymentMethods: [],
    banners: {
      home: {
        banner1: {
          title: '',
          description: '',
          image: ''
        }
      },
      about: {
        title: '',
        description: '',
        image: ''
      },
      contact: {
        title: '',
        description: '',
        image: ''
      }
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      whatsapp: '',
      youtube: ''
    },
    teamMembers: []
  });
  
  // Update local settings when settings from context change
  useEffect(() => {
    console.log('Settings from context changed:', settings);
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);
  
  const handleLogout = () => {
    logout();
    toast({
      title: 'تم تسجيل الخروج بنجاح',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };
  
  // Update the settings management functions to only update local state
  const handleSettingChange = (setting, value) => {
    setLocalSettings(prev => {
      const newSettings = { ...prev };
      
      // Handle nested settings
      if (setting.includes('.')) {
        const [parent, child] = setting.split('.');
        newSettings[parent] = {
          ...newSettings[parent],
          [child]: value
        };
      } else {
        newSettings[setting] = value;
      }
      
      return newSettings;
    });
  };
  
  const handlePaymentMethodChange = (index, field, value) => {
    if (!localSettings || !localSettings.paymentMethods) return;
    
    const updatedPaymentMethods = [...localSettings.paymentMethods];
    updatedPaymentMethods[index] = {
      ...updatedPaymentMethods[index],
      [field]: value
    };
    
    const updatedSettings = {
      ...localSettings,
      paymentMethods: updatedPaymentMethods
    };
    
    setLocalSettings(updatedSettings);
  };
  
  const handleSaveSettings = async () => {
    setIsSavingSettings(true);
    try {
      console.log('Save button clicked');
      console.log('Current localSettings:', localSettings);

      // Prepare settings data
      const settingsData = { ...localSettings };

      // Remove _id and __v fields
      delete settingsData._id;
      delete settingsData.__v;

      console.log('Prepared settings data:', settingsData);

      const response = await axiosInstance.put('/settings', settingsData);
      
      if (response.data.success) {
        // Update both context and local settings with the response data
        const updatedSettings = response.data.settings;
        
        updateSettings(updatedSettings);
        setLocalSettings(updatedSettings);
        
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
      setIsSavingSettings(false);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
      case 'approved':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'rejected':
      case 'banned':
        return 'red';
      default:
        return 'gray';
    }
  };
  
  const getStatusText = (status) => {
    switch (status) {
      case 'للبيع':
        return 'للبيع';
      case 'بيع':
        return 'تم البيع';
      default:
        return status;
    }
  };
  
  const handleRejectTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    onRejectTransactionOpen();
  };

  const handleConfirmReject = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/admin/points-transactions/${selectedTransaction._id}`,
        { status: 'failed' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update local state
      setPointsTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction._id === selectedTransaction._id
            ? { ...transaction, status: 'failed' }
            : transaction
        )
      );

    toast({
      title: "تم رفض العملية",
      description: "تم رفض عملية شراء النقاط بنجاح",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة المعاملة",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onRejectTransactionClose();
  };

  const handleApproveTransaction = (transaction) => {
    setSelectedTransaction(transaction);
    onApproveTransactionOpen();
  };

  const handleConfirmApprove = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `${process.env.REACT_APP_API_URL}/admin/points-transactions/${selectedTransaction._id}`,
        { status: 'completed' },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update local state
      setPointsTransactions(prevTransactions =>
        prevTransactions.map(transaction =>
          transaction._id === selectedTransaction._id
            ? { ...transaction, status: 'completed' }
            : transaction
        )
      );

    toast({
      title: "تمت الموافقة",
      description: "تمت الموافقة على عملية شراء النقاط بنجاح",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء تحديث حالة المعاملة",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onApproveTransactionClose();
  };

  const handleViewTransaction = (transaction) => {
    setSelectedTransaction({
      ...transaction,
      sellerName: transaction.user.name,
      sellerEmail: transaction.user.email,
      date: new Date(transaction.createdAt).toLocaleDateString('ar-SA'),
      screenshot: transaction.screenshotUrl
    });
    onViewTransactionOpen();
  };

  // Mobile-friendly transaction card component
  const TransactionCard = ({ transaction }) => (
    <Card 
      bg={cardBgColor}
      borderWidth="1px" 
      borderColor={cardBorderColor}
      borderRadius="lg" 
      overflow="hidden"
      mb={4}
    >
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <Box>
              <Text fontWeight="bold">{transaction.user.name}</Text>
              <Text fontSize="sm" color="gray.500">{transaction.user.email}</Text>
            </Box>
            <Badge
              colorScheme={
                transaction.status === 'completed'
                  ? 'green'
                  : transaction.status === 'rejected'
                  ? 'red'
                  : 'yellow'
              }
            >
              {transaction.status === 'completed' ? 'مكتمل' :
               transaction.status === 'rejected' ? 'مرفوض' : 'معلق'}
            </Badge>
          </HStack>

          <SimpleGrid columns={2} spacing={2}>
            <Box>
              <Text fontSize="sm" color="gray.500">المبلغ</Text>
            <Text>{transaction.amount} أوقية</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">النقاط</Text>
            <Text>{transaction.points}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">طريقة الدفع</Text>
            <Text>{transaction.paymentMethod}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">التاريخ</Text>
              <Text>{new Date(transaction.createdAt).toLocaleDateString('ar-SA')}</Text>
            </Box>
          </SimpleGrid>

          <HStack spacing={2} justify="flex-end">
          <Tooltip label="عرض">
            <IconButton
              icon={<Eye size={18} />}
              size="sm"
              variant="ghost"
              onClick={() => handleViewTransaction(transaction)}
            />
          </Tooltip>
            {transaction.status === 'pending' && (
              <>
          <Tooltip label="موافقة">
            <IconButton
              icon={<CheckCircle size={18} />}
              size="sm"
              variant="ghost"
                    colorScheme="green"
              onClick={() => handleApproveTransaction(transaction)}
            />
          </Tooltip>
          <Tooltip label="رفض">
            <IconButton
              icon={<XCircle size={18} />}
              size="sm"
              variant="ghost"
                    colorScheme="red"
              onClick={() => handleRejectTransaction(transaction)}
            />
          </Tooltip>
              </>
            )}
        </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

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
              leftIcon={<Users />}
              variant={activeTab === 1 ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              onClick={() => {
                setActiveTab(1);
                onMobileMenuClose();
              }}
            >
              المستخدمين
            </Button>
            <Button
              leftIcon={<Building2 />}
              variant={activeTab === 2 ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              onClick={() => {
                setActiveTab(2);
                onMobileMenuClose();
              }}
            >
              العقارات
            </Button>
            <Button
              leftIcon={<DollarSign />}
              variant={activeTab === 3 ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              onClick={() => {
                setActiveTab(3);
                onMobileMenuClose();
              }}
            >
              إدارة النقاط
            </Button>
            <Button
              leftIcon={<Settings />}
              variant={activeTab === 4 ? 'solid' : 'ghost'}
              justifyContent="flex-start"
              onClick={() => {
                setActiveTab(4);
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

  // Update the UserCard component to use the handlers
  const UserCard = ({ user }) => {
    return (
      <Card
        w="full"
        bg={bgColor}
        borderWidth="1px"
        borderColor={borderColor}
      >
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack spacing={4}>
              <Avatar size="lg" name={user.name} src={user.avatar} />
              <VStack align="start" spacing={1}>
                <Text fontSize="lg" fontWeight="bold">{user.name}</Text>
                <Text color="gray.500">رقم الهاتف: {user.phone}</Text>
                <Badge colorScheme={user.role === 'admin' ? 'purple' : user.role === 'superadmin' ? 'red' : 'blue'}>
                  {user.role === 'admin' ? 'مدير' : user.role === 'superadmin' ? 'مدير أعلى' : 'بائع'}
                </Badge>
              </VStack>
            </HStack>
            
            <Divider />
            
            <SimpleGrid columns={2} spacing={4}>
              <Box>
                <Text fontWeight="bold">عدد العقارات</Text>
                <Text>{user.properties?.length || 0}</Text>
              </Box>
              <Box>
                <Text fontWeight="bold">الحالة</Text>
                <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                  {user.isActive ? 'نشط' : 'محظور'}
                </Badge>
              </Box>
            </SimpleGrid>
            
            <HStack spacing={2} justify="flex-end">
              <Tooltip label="عرض">
                <IconButton
                  icon={<Eye />}
                  size="sm"
                  variant="ghost"
                  onClick={() => handleViewUser(user)}
                />
              </Tooltip>
              <Tooltip label="تعديل">
                <IconButton
                  icon={<Edit2 />}
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  onClick={() => handleEditUser(user)}
                />
              </Tooltip>
              {user.isActive ? (
              <Tooltip label="حظر">
                <IconButton
                  icon={<Ban />}
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={() => handleBanUser(user)}
                />
              </Tooltip>
              ) : (
                <Tooltip label="إلغاء الحظر">
                  <IconButton
                    icon={<CheckCircle />}
                    size="sm"
                    variant="ghost"
                    colorScheme="green"
                    onClick={() => handleUnbanUser(user)}
                  />
                </Tooltip>
              )}
            </HStack>
          </VStack>
        </CardBody>
      </Card>
    );
  };

  // Add these state variables after the existing state declarations
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen: isViewUserOpen, onOpen: onViewUserOpen, onClose: onViewUserClose } = useDisclosure();
  const { isOpen: isEditUserOpen, onOpen: onEditUserOpen, onClose: onEditUserClose } = useDisclosure();
  const { isOpen: isBanUserOpen, onOpen: onBanUserOpen, onClose: onBanUserClose } = useDisclosure();

  // Add these handler functions after the existing handlers
  const handleViewUser = (user) => {
    setSelectedUser(user);
    onViewUserOpen();
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    onEditUserOpen();
  };

  const handleBanUser = (user) => {
    setSelectedUser(user);
    onBanUserOpen();
  };

  const handleConfirmBan = async () => {
    try {
      // Update the user status in the backend
      const response = await updateUser(selectedUser._id, { isActive: false });
      
      if (response.success) {
    // Update the user status in the state
    setUsers(prevUsers => 
      prevUsers.map(u => 
            u._id === selectedUser._id 
              ? { ...u, isActive: false } 
          : u
      )
    );
    
    toast({
      title: "تم حظر المستخدم",
      description: `تم حظر المستخدم ${selectedUser.name} بنجاح`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
      } else {
        toast({
          title: "خطأ",
          description: response.error || "حدث خطأ أثناء حظر المستخدم",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء حظر المستخدم",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    
    onBanUserClose();
  };

  const handleUnbanUser = async (user) => {
    try {
      // Update the user status in the backend
      const response = await updateUser(user._id, { isActive: true });
      
      if (response.success) {
        // Update the user status in the state
        setUsers(prevUsers => 
          prevUsers.map(u => 
            u._id === user._id 
              ? { ...u, isActive: true } 
              : u
          )
        );
        
        toast({
          title: "تم إلغاء حظر المستخدم",
          description: `تم إلغاء حظر المستخدم ${user.name} بنجاح`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "خطأ",
          description: response.error || "حدث خطأ أثناء إلغاء حظر المستخدم",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء إلغاء حظر المستخدم",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Add these state variables after the existing state declarations
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRoleFilter, setUserRoleFilter] = useState('all'); // Add role filter

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getUsers();
      if (response.success) {
        setUsers(response.users);
      } else {
        setError(response.error);
      }
    } catch (err) {
      setError('حدث خطأ أثناء جلب المستخدمين');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (userData) => {
    try {
      const response = await addUser(userData);
      if (response.success) {
        setUsers([...users, response.user]);
        toast({
          title: 'تم إضافة المستخدم بنجاح',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء إضافة المستخدم',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const response = await updateUser(userId, userData);
      if (response.success) {
        setUsers(users.map(user => user.id === userId ? response.user : user));
        toast({
          title: 'تم تحديث المستخدم بنجاح',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء تحديث المستخدم',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await deleteUser(userId);
      if (response.success) {
        setUsers(users.filter(user => user.id !== userId));
        toast({
          title: 'تم حذف المستخدم بنجاح',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'خطأ',
          description: response.error,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'خطأ',
        description: 'حدث خطأ أثناء حذف المستخدم',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = userRoleFilter === 'all' || user.role === userRoleFilter;
    
    return matchesSearch && matchesRole;
  });

  // Add these state variables after the existing state declarations
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { isOpen: isViewPropertyOpen, onOpen: onViewPropertyOpen, onClose: onViewPropertyClose } = useDisclosure();
  const { isOpen: isApprovePropertyOpen, onOpen: onApprovePropertyOpen, onClose: onApprovePropertyClose } = useDisclosure();
  const { isOpen: isRejectPropertyOpen, onOpen: onRejectPropertyOpen, onClose: onRejectPropertyClose } = useDisclosure();

  // Add these handler functions after the existing handlers
  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    onViewPropertyOpen();
  };

  const handleApproveProperty = (property) => {
    setSelectedProperty(property);
    onApprovePropertyOpen();
  };

  const handleRejectProperty = (property) => {
    setSelectedProperty(property);
    onRejectPropertyOpen();
  };

  const handleConfirmPropertyApprove = () => {
    // Update the property status in the state
    setProperties(prevProperties => 
      prevProperties.map(p => 
        p.id === selectedProperty.id 
          ? { ...p, status: 'approved' } 
          : p
      )
    );
    
    toast({
      title: "تمت الموافقة على العقار",
      description: `تمت الموافقة على عقار ${selectedProperty.title} بنجاح`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onApprovePropertyClose();
  };

  const handleConfirmPropertyReject = async () => {
    try {
      const response = await axiosInstance.put(`/properties/${selectedProperty._id}/reject`);
      if (response.data.success) {
        setProperties(properties.filter(p => p._id !== selectedProperty._id));
    toast({
          title: "تم الرفض",
          description: "تم رفض العقار بنجاح",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
    onRejectPropertyClose();
      }
    } catch (error) {
      console.error('Error rejecting property:', error);
      toast({
        title: "خطأ",
        description: error.response?.data?.message || "حدث خطأ أثناء رفض العقار",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Remove mockProperties array and update the properties state initialization
  const [properties, setProperties] = useState([]);

  // Update the fetchProperties function
  const fetchProperties = async () => {
    try {
      const response = await axiosInstance.get('/properties?populate=seller');
      if (response.data.success) {
        setProperties(response.data.properties);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب العقارات",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Update the useEffect to fetch properties
  useEffect(() => {
    fetchProperties();
  }, []);

  // Update the PropertyCard component to be more mobile-friendly
  const PropertyCard = ({ property }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'للبيع':
          return 'blue';
        case 'بيع':
          return 'green';
        default:
          return 'gray';
      }
    };

    return (
      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        p={4}
        mb={4}
        bg="white"
        boxShadow="sm"
        w="full"
      >
        <VStack spacing={4} align="stretch">
          <Flex justify="space-between" align="center">
            <Heading size="md" noOfLines={1}>{property.title}</Heading>
            <Badge colorScheme={getStatusColor(property.status)}>
              {getStatusText(property.status)}
            </Badge>
          </Flex>

          {property.images && property.images.length > 0 && (
            <Box>
              <Image
                src={property.images[0]}
                alt={property.title}
                objectFit="cover"
                w="100%"
                h="200px"
                borderRadius="md"
              />
            </Box>
          )}

          <SimpleGrid columns={2} spacing={4}>
            <Box>
              <Text fontWeight="bold">السعر</Text>
              <Text>{property.price} أوقية</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">النوع</Text>
              <Text>{property.propertyType}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">الموقع</Text>
              <Text noOfLines={1}>{property.location}</Text>
            </Box>
            <Box>
              <Text fontWeight="bold">المساحة</Text>
              <Text>{property.area} م²</Text>
            </Box>
          </SimpleGrid>

          <Box>
            <Text fontWeight="bold">البائع</Text>
            <Text>{property.createdBy?.name || 'غير معروف'}</Text>
            <Text fontSize="sm" color="gray.500">{property.createdBy?.phone || ''}</Text>
          </Box>

          <Flex justify="space-between" mt={2}>
            <Button
              leftIcon={<Eye />}
              size="sm"
              variant="outline"
              onClick={() => handleViewProperty(property)}
            >
              عرض
            </Button>
            <Button
              leftIcon={<XCircle />}
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={() => handleRejectProperty(property)}
            >
              رفض
            </Button>
          </Flex>
        </VStack>
      </Box>
    );
  };

  // Update the PointsTransactionCard component definition
  const PointsTransactionCard = ({ transaction }) => (
    <Card 
      bg={cardBgColor}
      borderWidth="1px" 
      borderColor={cardBorderColor}
      borderRadius="lg" 
      overflow="hidden"
      mb={4}
    >
      <CardBody>
        <VStack align="stretch" spacing={3}>
          <HStack justify="space-between">
            <Box>
              <Text fontWeight="bold">{transaction.sellerName}</Text>
              <Text fontSize="sm" color="gray.500">{transaction.sellerEmail}</Text>
            </Box>
            <Badge colorScheme="yellow">معلق</Badge>
          </HStack>

          <SimpleGrid columns={2} spacing={2}>
            <Box>
              <Text fontSize="sm" color="gray.500">المبلغ</Text>
              <Text>{transaction.amount} أوقية</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">النقاط</Text>
              <Text>{transaction.points}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">طريقة الدفع</Text>
              <Text>{transaction.paymentMethod}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.500">التاريخ</Text>
              <Text>{transaction.date}</Text>
            </Box>
          </SimpleGrid>

          <HStack spacing={2} justify="flex-end">
            <Tooltip label="عرض">
              <IconButton
                icon={<Eye size={18} />}
                size="sm"
                variant="ghost"
                onClick={() => handleViewTransaction(transaction)}
              />
            </Tooltip>
            <Tooltip label="موافقة">
              <IconButton
                icon={<CheckCircle size={18} />}
                size="sm"
                variant="ghost"
                colorScheme="green"
                onClick={() => handleApproveTransaction(transaction)}
              />
            </Tooltip>
            <Tooltip label="رفض">
              <IconButton
                icon={<XCircle size={18} />}
                size="sm"
                variant="ghost"
                colorScheme="red"
                onClick={() => handleRejectTransaction(transaction)}
              />
            </Tooltip>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );

  const navigate = useNavigate();

  const { isOpen: isAddUserOpen, onOpen: onAddUserOpen, onClose: onAddUserClose } = useDisclosure();
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    whatsapp: '',
    role: 'seller',
    status: 'pending',
    company: '',
    address: ''
  });

  const handleAddUserSubmit = () => {
    // Call the handleAddUser function to make the API call
    handleAddUser(newUser);
    
    // Reset the form
    setNewUser({
      name: '',
      email: '',
      password: '',
      phone: '',
      whatsapp: '',
      role: 'seller',
      status: 'pending',
      company: '',
      address: ''
    });
    
    // Close the modal
    onAddUserClose();
  };

  const [isLoading, setIsLoading] = useState(false);

  const handleImageUpload = async (file, paymentMethodId) => {
    try {
      const imageUrl = await uploadToCloudinary(file);
      setLocalSettings(prev => ({
        ...prev,
        paymentMethods: prev.paymentMethods.map(method => 
          method._id === paymentMethodId ? { ...method, logo: imageUrl } : method
        )
      }));
    } catch (error) {
      console.error('Error uploading payment method image:', error);
      toast({
        title: 'خطأ في رفع الصورة',
        description: 'فشل في رفع شعار طريقة الدفع',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const [pointsTransactions, setPointsTransactions] = useState([]);
  const [loadingPoints, setLoadingPoints] = useState(false);

  const fetchPointsTransactions = async () => {
  try {
    setLoadingPoints(true);
    const token = localStorage.getItem('token');
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/points-transactions`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setPointsTransactions(response.data.transactions);
  } catch (error) {
    toast({
      title: 'خطأ',
      description: 'فشل في جلب معاملات النقاط',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  } finally {
    setLoadingPoints(false);
  }
};
 const handleUpdatePointsTransaction = async (transactionId, status) => {
  try {
    const token = localStorage.getItem('token');
    await axios.put(
      `${process.env.REACT_APP_API_URL}/admin/points-transactions/${transactionId}`, 
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    toast({
      title: 'نجاح',
      description: 'تم تحديث حالة المعاملة بنجاح',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    fetchPointsTransactions(); // Refresh the list after update
  } catch (error) {
    toast({
      title: 'خطأ',
      description: 'فشل في تحديث حالة المعاملة',
      status: 'error',
      duration: 3000,
      isClosable: true,
    });
  }
};
  useEffect(() => {
    fetchPointsTransactions();
  }, []);

  // Remove mockStats and add real stats state
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProperties: 0,
    activeProperties: 0,
    totalViews: 0,
    totalSales: 0,
    totalSalesAmount: 0,
    totalCredits: 0,
    activeSellers: 0,
    pointsPerProperty: 0,
    totalTransactions: 0,
    monthlyViews: 0
  });

  // Add function to fetch stats
  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/admin/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "خطأ",
        description: "حدث خطأ أثناء جلب الإحصائيات",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Add useEffect to fetch stats
  useEffect(() => {
    fetchStats();
  }, []);

  const handleTeamMemberChange = (index, field, value) => {
    setLocalSettings(prev => {
      const newTeamMembers = [...(prev.teamMembers || [])];
      newTeamMembers[index] = {
        ...newTeamMembers[index],
        [field]: value
      };
      return {
        ...prev,
        teamMembers: newTeamMembers
      };
    });
  };

  const handleTeamMemberSocialChange = (index, platform, value) => {
    setLocalSettings(prev => {
      const newTeamMembers = [...(prev.teamMembers || [])];
      newTeamMembers[index] = {
        ...newTeamMembers[index],
        social: {
          ...(newTeamMembers[index]?.social || {}),
          [platform]: value
        }
      };
      return {
        ...prev,
        teamMembers: newTeamMembers
      };
    });
  };

  const handleAddTeamMember = () => {
    setLocalSettings(prev => ({
      ...prev,
      teamMembers: [
        ...(prev.teamMembers || []),
        {
          name: '',
          position: '',
          bio: '',
          image: '',
          social: {
            facebook: '',
            twitter: '',
            instagram: '',
            linkedin: ''
          }
        }
      ]
    }));
  };

  const handleDeleteTeamMember = (index) => {
    setLocalSettings(prev => {
      const newTeamMembers = [...(prev.teamMembers || [])];
      newTeamMembers.splice(index, 1);
      return {
        ...prev,
        teamMembers: newTeamMembers
      };
    });
  };

  const handleTeamMemberImageUpload = async (index, file) => {
    try {
      // Show preview immediately
      const previewUrl = URL.createObjectURL(file);
      setLocalSettings(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.map((member, i) => 
          i === index ? { ...member, image: previewUrl } : member
        )
      }));

      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      
      // Update with actual URL after upload
      setLocalSettings(prev => ({
        ...prev,
        teamMembers: prev.teamMembers.map((member, i) => 
          i === index ? { ...member, image: imageUrl } : member
        )
      }));
    } catch (error) {
      console.error('Error uploading team member image:', error);
      toast({
        title: 'خطأ في رفع الصورة',
        description: 'فشل في رفع صورة العضو',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Update the team member card to handle image display
  const TeamMemberCard = ({ member, index }) => (
    <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
      <VStack spacing={4}>
        <Box position="relative" width="100px" height="100px">
          <Image
            src={member.image || '/placeholder.png'}
            alt={member.name}
            width="100px"
            height="100px"
            objectFit="cover"
            borderRadius="full"
            fallbackSrc="/placeholder.png"
          />
        </Box>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="100%">
          <FormControl>
            <FormLabel>الاسم</FormLabel>
            <Input
              value={member.name}
              onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>المنصب</FormLabel>
            <Input
              value={member.position}
              onChange={(e) => handleTeamMemberChange(index, 'position', e.target.value)}
            />
          </FormControl>
          <FormControl gridColumn={{ base: '1 / -1', md: '1 / -1' }}>
            <FormLabel>السيرة الذاتية</FormLabel>
            <Textarea
              value={member.bio}
              onChange={(e) => handleTeamMemberChange(index, 'bio', e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>فيسبوك</FormLabel>
            <Input
              value={member.social?.facebook || ''}
              onChange={(e) => handleTeamMemberSocialChange(index, 'facebook', e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>تويتر</FormLabel>
            <Input
              value={member.social?.twitter || ''}
              onChange={(e) => handleTeamMemberSocialChange(index, 'twitter', e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>انستغرام</FormLabel>
            <Input
              value={member.social?.instagram || ''}
              onChange={(e) => handleTeamMemberSocialChange(index, 'instagram', e.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>لينكد إن</FormLabel>
            <Input
              value={member.social?.linkedin || ''}
              onChange={(e) => handleTeamMemberSocialChange(index, 'linkedin', e.target.value)}
            />
          </FormControl>
          <FormControl gridColumn={{ base: '1 / -1', md: '1 / -1' }}>
            <FormLabel>صورة العضو</FormLabel>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleTeamMemberImageUpload(index, e.target.files[0]);
                }
              }}
            />
          </FormControl>
        </SimpleGrid>
        <Button colorScheme="red" onClick={() => handleDeleteTeamMember(index)}>
          حذف العضو
        </Button>
      </VStack>
    </Box>
  );

  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axiosInstance.get('/settings');
        if (response.data.success) {
          const settings = response.data.settings;
          console.log('Fetched settings:', settings);
          
          // Set local settings with proper number conversion
          setLocalSettings({
            ...settings,
            pointCost: Number(settings.pointCost) || 0,
            pointsPerProperty: Number(settings.pointsPerProperty) || 0,
            minPointsToBuy: Number(settings.minPointsToBuy) || 0,
            maxPointsToBuy: Number(settings.maxPointsToBuy) || 0
          });
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
        toast({
          title: 'خطأ',
          description: 'حدث خطأ أثناء جلب الإعدادات',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchSettings();
  }, []);

  const handleBannerImageUpload = async (file, bannerType, bannerIndex = null) => {
    try {
      const imageUrl = await uploadToCloudinary(file);
      setLocalSettings(prev => ({
        ...prev,
        banners: {
          ...prev.banners,
          [bannerType]: bannerType === 'home' ? {
            ...prev.banners[bannerType],
            [bannerIndex]: {
              ...prev.banners[bannerType][bannerIndex],
              image: imageUrl
            }
          } : {
            ...prev.banners[bannerType],
            image: imageUrl
          }
        }
      }));
    } catch (error) {
      console.error('Error uploading banner image:', error);
      toast({
        title: 'خطأ في رفع الصورة',
        description: 'فشل في رفع صورة البانر',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAddBanner = (pageType) => {
    setLocalSettings(prev => ({
      ...prev,
      banners: {
        ...prev.banners,
        [pageType]: {
          ...prev.banners[pageType],
          [`banner${Object.keys(prev.banners[pageType] || {}).length + 1}`]: {
            title: '',
            description: '',
            image: ''
          }
        }
      }
    }));
  };

  const handleDeleteBanner = (pageType, bannerKey) => {
    setLocalSettings(prev => {
      const updatedBanners = { ...prev.banners };
      delete updatedBanners[pageType][bannerKey];
      return {
        ...prev,
        banners: updatedBanners
      };
    });
  };

  const handleBannerChange = (pageType, bannerKey, field, value) => {
    setLocalSettings(prev => ({
      ...prev,
      banners: {
        ...prev.banners,
        [pageType]: pageType === 'home' ? {
          ...prev.banners[pageType],
          [bannerKey]: {
            ...prev.banners[pageType][bannerKey],
            [field]: value
          }
        } : {
          ...prev.banners[pageType],
          [field]: value
        }
      }
    }));
  };

  const BannerCard = ({ pageType, bannerKey, banner }) => (
    <Box borderWidth="1px" borderRadius="lg" p={4} mb={4}>
      <VStack spacing={4}>
        <Box position="relative" width="100%" height="200px">
          <Image
            src={banner?.image || '/placeholder.png'}
            alt={banner?.title || ''}
            width="100%"
            height="200px"
            objectFit="cover"
            borderRadius="md"
            fallbackSrc="/placeholder.png"
          />
        </Box>
        <FormControl>
          <FormLabel>العنوان</FormLabel>
          <Input
            value={banner?.title || ''}
            onChange={(e) => handleBannerChange(pageType, bannerKey, 'title', e.target.value)}
            placeholder={pageType === 'home' ? 'عنوان البانر الرئيسي' : pageType === 'about' ? 'عنوان صفحة من نحن' : 'عنوان صفحة اتصل بنا'}
          />
        </FormControl>
        <FormControl>
          <FormLabel>الوصف</FormLabel>
          <Textarea
            value={banner?.description || ''}
            onChange={(e) => handleBannerChange(pageType, bannerKey, 'description', e.target.value)}
            placeholder={pageType === 'home' ? 'وصف البانر الرئيسي' : pageType === 'about' ? 'وصف صفحة من نحن' : 'وصف صفحة اتصل بنا'}
          />
        </FormControl>
        <FormControl>
          <FormLabel>الصورة</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleBannerImageUpload(e.target.files[0], pageType, pageType === 'home' ? bannerKey : null);
              }
            }}
          />
        </FormControl>
        {pageType === 'home' && (
          <Button
            colorScheme="red"
            size="sm"
            onClick={() => handleDeleteBanner(pageType, bannerKey)}
          >
            حذف البانر
          </Button>
        )}
      </VStack>
    </Box>
  );

  const [propertySearchQuery, setPropertySearchQuery] = useState('');
  const [propertyStatusFilter, setPropertyStatusFilter] = useState('all');

  // Add filtering logic for properties
  const filteredProperties = properties.filter(property => {
    const matchesSearch = 
      property.title.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(propertySearchQuery.toLowerCase()) ||
      property.propertyType.toLowerCase().includes(propertySearchQuery.toLowerCase());
    
    const matchesStatus = propertyStatusFilter === 'all' || property.status === propertyStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <Container maxW="container.xl" py={isMobile ? 4 : 10} px={isMobile ? 2 : 4}>
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Grid templateColumns={{ base: '1fr', lg: '250px 1fr' }} gap={isMobile ? 4 : 8}>
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
                    <Text color="gray.500" fontSize="sm">
                      {user?.phone}
                    </Text>
                    <Badge colorScheme="purple">مدير النظام</Badge>
                  </Stack>
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
                    leftIcon={<Users />}
                    variant={activeTab === 1 ? 'solid' : 'ghost'}
                    justifyContent="flex-start"
                    onClick={() => setActiveTab(1)}
                  >
                    المستخدمين
                  </Button>
                  <Button
                    leftIcon={<Building2 />}
                    variant={activeTab === 2 ? 'solid' : 'ghost'}
                    justifyContent="flex-start"
                    onClick={() => setActiveTab(2)}
                  >
                    العقارات
                  </Button>
                  <Button
                    leftIcon={<DollarSign />}
                    variant={activeTab === 3 ? 'solid' : 'ghost'}
                    justifyContent="flex-start"
                    onClick={() => setActiveTab(3)}
                  >
                    إدارة النقاط
                  </Button>
                  <Button
                    leftIcon={<Settings />}
                    variant={activeTab === 4 ? 'solid' : 'ghost'}
                    justifyContent="flex-start"
                    onClick={() => setActiveTab(4)}
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
          <Box position="relative">
            <Tabs index={activeTab} onChange={setActiveTab}>
              {/* Show tab list only on mobile */}
              {isMobile && (
                <TabList 
                  mb={6} 
                  display="flex" 
                  flexWrap="wrap" 
                  justifyContent="center"
                  bg={bgColor}
                  p={4}
                  rounded="xl"
                  boxShadow="xl"
                  borderWidth="1px"
                  borderColor={borderColor}
                >
                  <Tab>لوحة التحكم</Tab>
                  <Tab>المستخدمين</Tab>
                  <Tab>العقارات</Tab>
                  <Tab>إدارة النقاط</Tab>
                  <Tab>الإعدادات</Tab>
                </TabList>
              )}
              
              <TabPanels>
                {/* Dashboard Tab */}
                <TabPanel px={isMobile ? 0 : 4}>
                  <Stack spacing={8}>
                    <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} spacing={isMobile ? 3 : 6}>
                      <Stat
                        bg={bgColor}
                        p={6}
                        rounded="xl"
                        boxShadow="xl"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <StatLabel>إجمالي المستخدمين</StatLabel>
                        <StatNumber>{stats.totalUsers}</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {stats.activeUsers} نشط
                        </StatHelpText>
                      </Stat>
                      
                      <Stat
                        bg={bgColor}
                        p={6}
                        rounded="xl"
                        boxShadow="xl"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <StatLabel>إجمالي العقارات</StatLabel>
                        <StatNumber>{stats.totalProperties}</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {stats.activeProperties} نشط
                        </StatHelpText>
                      </Stat>
                      
                      <Stat
                        bg={bgColor}
                        p={6}
                        rounded="xl"
                        boxShadow="xl"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <StatLabel>إجمالي المشاهدات</StatLabel>
                        <StatNumber>{stats.totalViews}</StatNumber>
                        <StatHelpText>
                          
                        </StatHelpText>
                      </Stat>
                      
                      <Stat
                        bg={bgColor}
                        p={6}
                        rounded="xl"
                        boxShadow="xl"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <StatLabel>إجمالي المبيعات</StatLabel>
                        <StatNumber>{stats.totalSales}</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {stats.totalSalesAmount?.toLocaleString() || 0} ريال
                        </StatHelpText>
                      </Stat>
                    </SimpleGrid>
                    
                    <Box
                      bg={bgColor}
                      p={isMobile ? 3 : 6}
                      rounded="xl"
                      boxShadow="xl"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Stack spacing={6}>
                        <Heading size="md">عمليات شراء النقاط</Heading>
                        
                        {loadingPoints ? (
                          <Center>
                            <Spinner size="xl" />
                          </Center>
                        ) : pointsTransactions.filter(t => t.status === 'pending').length === 0 ? (
                          <Center>
                            <Text color="gray.500">لا توجد عمليات شراء نقاط معلقة</Text>
                          </Center>
                        ) : isMobile ? (
                          // Mobile view - cards instead of table
                          <VStack align="stretch" spacing={4}>
                            {pointsTransactions
                              .filter(t => t.status === 'pending')
                              .map((transaction) => (
                                <TransactionCard key={transaction._id} transaction={transaction} />
                            ))}
                          </VStack>
                        ) : (
                          // Desktop view - table
                          <TableContainer>
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Th>البائع</Th>
                                  <Th>المبلغ</Th>
                                  <Th>النقاط</Th>
                                  <Th>طريقة الدفع</Th>
                                  <Th>التاريخ</Th>
                                  <Th>الحالة</Th>
                                  <Th>الإجراءات</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {pointsTransactions
                                  .filter(t => t.status === 'pending')
                                  .map((transaction) => (
                                    <Tr key={transaction._id}>
                                      <Td>
                                        <VStack align="start" spacing={1}>
                                          <Text fontWeight="medium">{transaction.user.name}</Text>
                                          <Text fontSize="sm" color="gray.500">{transaction.user.email}</Text>
                                        </VStack>
                                      </Td>
                                    <Td>{transaction.amount} أوقية</Td>
                                    <Td>{transaction.points}</Td>
                                    <Td>{transaction.paymentMethod}</Td>
                                      <Td>{new Date(transaction.createdAt).toLocaleDateString('ar-SA')}</Td>
                                    <Td>
                                      <Badge colorScheme="yellow">معلق</Badge>
                                    </Td>
                                    <Td>
                                      <HStack spacing={2}>
                                        <Tooltip label="عرض">
                                          <IconButton
                                            icon={<Eye size={18} />}
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleViewTransaction(transaction)}
                                          />
                                        </Tooltip>
                                        <Tooltip label="موافقة">
                                          <IconButton
                                            icon={<CheckCircle size={18} />}
                                            size="sm"
                                            variant="ghost"
                                              colorScheme="green"
                                            onClick={() => handleApproveTransaction(transaction)}
                                          />
                                        </Tooltip>
                                        <Tooltip label="رفض">
                                          <IconButton
                                            icon={<XCircle size={18} />}
                                            size="sm"
                                            variant="ghost"
                                              colorScheme="red"
                                            onClick={() => handleRejectTransaction(transaction)}
                                          />
                                        </Tooltip>
                                      </HStack>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </TabPanel>
                
                {/* Users Tab */}
                <TabPanel>
                  <Stack spacing={6}>
                    <Box
                      bg={bgColor}
                      p={6}
                      rounded="xl"
                      boxShadow="xl"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Stack spacing={6}>
                        <Stack direction={{ base: 'column', md: 'row' }} justify="space-between" align="center">
                          <Heading size="md">إدارة المستخدمين</Heading>
                          <HStack spacing={4}>
                          <Input
                            placeholder="بحث عن مستخدم..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            maxW="300px"
                            size="md"
                          />
                            <Select
                              value={userRoleFilter}
                              onChange={(e) => setUserRoleFilter(e.target.value)}
                              maxW="200px"
                              size="md"
                            >
                              <option value="all">جميع المستخدمين</option>
                              <option value="seller">البائعين</option>
                              <option value="admin">المدراء</option>
                              <option value="superadmin">المدراء الأعلى</option>
                            </Select>
                            <Button
                              leftIcon={<UserPlus />}
                              colorScheme="green"
                              onClick={onAddUserOpen}
                            >
                              إضافة مستخدم
                            </Button>
                          </HStack>
                        </Stack>
                        
                        {loading ? (
                          <Center>
                            <Spinner size="xl" />
                          </Center>
                        ) : error ? (
                          <Alert status="error">
                            <AlertIcon />
                            {error}
                          </Alert>
                        ) : isMobile ? (
                          <VStack spacing={4}>
                            {filteredUsers.map((user) => (
                              <UserCard key={user.id} user={user} />
                            ))}
                          </VStack>
                        ) : (
                          <Table variant="simple">
                            <Thead>
                              <Tr>
                                <Th>المستخدم</Th>
                                <Th>الدور</Th>
                                <Th>الحالة</Th>
                                <Th>التاريخ</Th>
                                <Th>الإجراءات</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {filteredUsers.map((user) => (
                                <Tr key={user.id}>
                                  <Td>
                                    <HStack spacing={2}>
                                      <Avatar size="sm" name={user.name} />
                                      <Stack spacing={0}>
                                        <Text fontWeight="medium">{user.name}</Text>
                                        <Text fontSize="sm" color="gray.500">
                                          {user.email}
                                        </Text>
                                      </Stack>
                                    </HStack>
                                  </Td>
                                  <Td>
                                    <Badge colorScheme={
                                      user.role === 'admin' ? 'purple' :
                                      user.role === 'superadmin' ? 'red' :
                                      'blue'
                                    }>
                                      {user.role === 'admin' ? 'مدير' :
                                       user.role === 'superadmin' ? 'مدير أعلى' :
                                       'بائع'}
                                    </Badge>
                                  </Td>
                                  <Td>
                                    <Badge colorScheme={user.isActive ? 'green' : 'red'}>
                                      {user.isActive ? 'نشط' : 'محظور'}
                                    </Badge>
                                  </Td>
                                  <Td>{user.date}</Td>
                                  <Td>
                                    <HStack spacing={2}>
                                      <Tooltip label="عرض">
                                        <IconButton
                                          icon={<Eye />}
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => {
                                            setSelectedUser(user);
                                            onViewUserOpen();
                                          }}
                                        />
                                      </Tooltip>
                                      <Tooltip label="تعديل">
                                        <IconButton
                                          icon={<Edit2 />}
                                          size="sm"
                                          variant="ghost"
                                          colorScheme="blue"
                                          onClick={() => {
                                            setSelectedUser(user);
                                            onEditUserOpen();
                                          }}
                                        />
                                      </Tooltip>
                                      {user.isActive ? (
                                      <Tooltip label="حظر">
                                        <IconButton
                                          icon={<Ban />}
                                          size="sm"
                                          variant="ghost"
                                          colorScheme="red"
                                          onClick={() => handleBanUser(user)}
                                        />
                                      </Tooltip>
                                      ) : (
                                        <Tooltip label="إلغاء الحظر">
                                          <IconButton
                                            icon={<CheckCircle />}
                                            size="sm"
                                            variant="ghost"
                                            colorScheme="green"
                                            onClick={() => handleUnbanUser(user)}
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
                <TabPanel>
                  <Stack spacing={6}>
                    <Box>
                      <Heading size="lg" mb={6}>إدارة العقارات</Heading>
                      <Stack spacing={4}>
                        <Flex
                          direction={{ base: "column", md: "row" }}
                          justify="space-between"
                          align={{ base: "stretch", md: "center" }}
                          gap={4}
                        >
                          <InputGroup maxW={{ base: "100%", md: "320px" }}>
                            <InputLeftElement pointerEvents="none">
                              <Search2Icon color="gray.300" />
                            </InputLeftElement>
                            <Input
                              placeholder="البحث عن عقار..."
                              value={propertySearchQuery}
                              onChange={(e) => setPropertySearchQuery(e.target.value)}
                            />
                          </InputGroup>
                          
                          <Select
                            maxW={{ base: "100%", md: "200px" }}
                            value={propertyStatusFilter}
                            onChange={(e) => setPropertyStatusFilter(e.target.value)}
                          >
                            <option value="all">جميع الحالات</option>
                            <option value="pending">قيد الانتظار</option>
                            <option value="approved">تمت الموافقة</option>
                            <option value="rejected">مرفوض</option>
                          </Select>
                        </Flex>

                        {filteredProperties.length === 0 ? (
                          <Box textAlign="center" py={10}>
                            <Text>لا توجد عقارات متاحة</Text>
                          </Box>
                        ) : (
                          <SimpleGrid
                            columns={{ base: 1, md: 2, lg: 3 }}
                            spacing={6}
                            w="full"
                          >
                            {filteredProperties.map((property) => (
                              <PropertyCard key={property._id} property={property} />
                            ))}
                          </SimpleGrid>
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </TabPanel>
                
                {/* Points Management Tab */}
                <TabPanel>
                  <Stack spacing={6}>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                      <Stat
                        bg={bgColor}
                        p={6}
                        rounded="xl"
                        boxShadow="xl"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <StatLabel>إجمالي النقاط</StatLabel>
                        <StatNumber>{stats.totalPoints}</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          {stats.activeSellers} بائع نشط
                        </StatHelpText>
                      </Stat>
                      
                      <Stat
                        bg={bgColor}
                        p={6}
                        rounded="xl"
                        boxShadow="xl"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <StatLabel>نقاط لكل عقار</StatLabel>
                        <StatNumber>{stats.pointsPerProperty}</StatNumber>
                        <StatHelpText>
                          <StatArrow type="decrease" />
                          تكلفة نشر عقار
                        </StatHelpText>
                      </Stat>
                      
                      <Stat
                        bg={bgColor}
                        p={6}
                        rounded="xl"
                        boxShadow="xl"
                        borderWidth="1px"
                        borderColor={borderColor}
                      >
                        <StatLabel>إجمالي المعاملات</StatLabel>
                        <StatNumber>{stats.totalTransactions}</StatNumber>
                        <StatHelpText>
                          <StatArrow type="increase" />
                          معاملات ناجحة
                        </StatHelpText>
                      </Stat>
                    </SimpleGrid>
                    
                    <Box
                      bg={bgColor}
                      p={6}
                      rounded="xl"
                      boxShadow="xl"
                      borderWidth="1px"
                      borderColor={borderColor}
                    >
                      <Stack spacing={6}>
                        <Stack direction="row" justify="space-between" align="center">
                          <Heading size="md">معاملات النقاط</Heading>
                          <Button
                            leftIcon={<Plus />}
                            colorScheme="primary"
                            onClick={onOpen}
                          >
                            إضافة نقاط
                          </Button>
                        </Stack>
                        
                        {loadingPoints ? (
                          <Center>
                            <Spinner size="xl" />
                          </Center>
                        ) : pointsTransactions.length === 0 ? (
                          <Center>
                            <Text color="gray.500">لا توجد عمليات شراء نقاط</Text>
                          </Center>
                        ) : isMobile ? (
                          // Mobile view - cards instead of table
                          <VStack align="stretch" spacing={4}>
                            {pointsTransactions.map((transaction) => (
                              <TransactionCard key={transaction._id} transaction={transaction} />
                            ))}
                          </VStack>
                        ) : (
                          // Desktop view - table
                          <TableContainer>
                            <Table variant="simple">
                              <Thead>
                                <Tr>
                                  <Th>البائع</Th>
                                  <Th>المبلغ</Th>
                                  <Th>النقاط</Th>
                                  <Th>طريقة الدفع</Th>
                                  <Th>التاريخ</Th>
                                  <Th>الحالة</Th>
                                  <Th>الإجراءات</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {pointsTransactions.map((transaction) => (
                                  <Tr key={transaction._id}>
                                    <Td>
                                      <VStack align="start" spacing={1}>
                                        <Text fontWeight="medium">{transaction.user.name}</Text>
                                        <Text fontSize="sm" color="gray.500">{transaction.user.email}</Text>
                                      </VStack>
                                    </Td>
                                    <Td>{transaction.amount} أوقية</Td>
                                    <Td>{transaction.points}</Td>
                                    <Td>{transaction.paymentMethod}</Td>
                                    <Td>{new Date(transaction.createdAt).toLocaleDateString('ar-SA')}</Td>
                                    <Td>
                                      <Badge
                                        colorScheme={
                                          transaction.status === 'completed'
                                            ? 'green'
                                            : transaction.status === 'rejected'
                                            ? 'red'
                                            : 'yellow'
                                        }
                                      >
                                        {transaction.status === 'completed' ? 'مكتمل' :
                                         transaction.status === 'rejected' ? 'مرفوض' : 'معلق'}
                                      </Badge>
                                    </Td>
                                    <Td>
                                      <HStack spacing={2}>
                                        <Tooltip label="عرض">
                                          <IconButton
                                            icon={<Eye size={18} />}
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleViewTransaction(transaction)}
                                          />
                                        </Tooltip>
                                        {transaction.status === 'pending' && (
                                          <>
                                        <Tooltip label="موافقة">
                                          <IconButton
                                            icon={<CheckCircle size={18} />}
                                            size="sm"
                                            variant="ghost"
                                            colorScheme="green"
                                            onClick={() => handleApproveTransaction(transaction)}
                                          />
                                        </Tooltip>
                                        <Tooltip label="رفض">
                                          <IconButton
                                            icon={<XCircle size={18} />}
                                            size="sm"
                                            variant="ghost"
                                            colorScheme="red"
                                            onClick={() => handleRejectTransaction(transaction)}
                                          />
                                        </Tooltip>
                                          </>
                                        )}
                                      </HStack>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </TabPanel>
                
                {/* Settings Tab */}
                <TabPanel>
                  <Tabs>
                    <TabList mb={4}>
                      <Tab>إدارة فريق العمل</Tab>             
                      <Tab>إعدادات النقاط</Tab>
                      <Tab>طرق الدفع</Tab>
                      <Tab>إعدادات الصفحة الرئيسية</Tab>
                      <Tab>إعدادات صفحة من نحن</Tab>
                      <Tab>إعدادات صفحة الاتصال</Tab>
                      <Tab>إعدادات البانرات</Tab>
                      <Tab>إعدادات التواصل الاجتماعي</Tab>
                      <Tab>إعدادات الموقع</Tab>
                    </TabList>

                    <TabPanels>
                      {/* Team Members Settings */}
                      <TabPanel>
                        <VStack spacing={4}>
                          {localSettings?.teamMembers?.map((member, index) => (
                            <TeamMemberCard key={index} member={member} index={index} />
                          ))}
                          <Button
                            colorScheme="blue"
                            onClick={handleAddTeamMember}
                          >
                            إضافة عضو جديد
                          </Button>
                        </VStack>
                      </TabPanel>

                      {/* Existing Points Settings */}
                      <TabPanel>
                        <VStack spacing={6} align="stretch">
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <FormControl>
                              <FormLabel>تكلفة النقطة</FormLabel>
                              <Input
                                type="number"
                                value={localSettings?.pointCost || 0}
                                onChange={(e) => handleSettingChange('pointCost', Number(e.target.value))}
                                placeholder="تكلفة النقطة"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>النقاط لكل عقار</FormLabel>
                              <Input
                                type="number"
                                value={localSettings?.pointsPerProperty || 0}
                                onChange={(e) => handleSettingChange('pointsPerProperty', Number(e.target.value))}
                                placeholder="النقاط لكل عقار"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>الحد الأدنى لشراء النقاط</FormLabel>
                              <Input
                                type="number"
                                value={localSettings?.minPointsToBuy || 0}
                                onChange={(e) => handleSettingChange('minPointsToBuy', Number(e.target.value))}
                                placeholder="الحد الأدنى لشراء النقاط"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>الحد الأقصى لشراء النقاط</FormLabel>
                              <Input
                                type="number"
                                value={localSettings?.maxPointsToBuy || 0}
                                onChange={(e) => handleSettingChange('maxPointsToBuy', Number(e.target.value))}
                                placeholder="الحد الأقصى لشراء النقاط"
                              />
                            </FormControl>
                          </SimpleGrid>
                        </VStack>
                      </TabPanel>

                      {/* Existing Payment Methods */}
                      <TabPanel>
                        <VStack spacing={4} align="stretch">
                          {!localSettings?.paymentMethods?.length ? (
                            <Text color="gray.500" textAlign="center">لا توجد طرق دفع مضافة</Text>
                          ) : (
                            localSettings.paymentMethods.map((method, index) => (
                              <Box key={index} p={4} borderWidth="1px" borderRadius="lg">
                                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                            <FormControl>
                                    <FormLabel>اختر البنك</FormLabel>
                                    <Select
                                      value={method.bankId}
                                      onChange={(e) => handlePaymentMethodChange(index, 'bankId', e.target.value)}
                                      placeholder="اختر البنك"
                                    >
                                      {staticBanks.map((bank) => (
                                        <option key={bank.id} value={bank.id}>
                                          {bank.name}
                                        </option>
                                      ))}
                                    </Select>
                            </FormControl>
                            <FormControl>
                                    <FormLabel>رقم الحساب</FormLabel>
                                    <Input
                                      value={method.accountNumber}
                                      onChange={(e) => handlePaymentMethodChange(index, 'accountNumber', e.target.value)}
                                      placeholder="رقم الحساب"
                                />
                            </FormControl>
                            <FormControl>
                                    <FormLabel>اسم صاحب الحساب</FormLabel>
                                    <Input
                                      value={method.accountName}
                                      onChange={(e) => handlePaymentMethodChange(index, 'accountName', e.target.value)}
                                      placeholder="اسم صاحب الحساب"
                                />
                            </FormControl>
                            <FormControl>
                                    <FormLabel>شعار البنك</FormLabel>
                                    <VStack spacing={2} align="stretch">
                                      {method.image && (
                                        <Box position="relative" width="100px" height="100px">
                                          <Image
                                            src={method.image}
                                            alt={`${staticBanks.find(b => b.id === method.bankId)?.name} logo`}
                                            objectFit="contain"
                                            width="100%"
                                            height="100%"
                                          />
                                        </Box>
                                      )}
                                      <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={async (e) => {
                                          const file = e.target.files[0];
                                          if (file) {
                                            try {
                                              const imageUrl = await uploadToCloudinary(file);
                                              handlePaymentMethodChange(index, 'image', imageUrl);
                                              toast({
                                                title: "تم رفع الصورة بنجاح",
                                                status: "success",
                                                duration: 3000,
                                                isClosable: true,
                                              });
                                            } catch (error) {
                                              toast({
                                                title: "خطأ",
                                                description: "فشل في رفع الصورة",
                                                status: "error",
                                                duration: 3000,
                                                isClosable: true,
                                              });
                                            }
                                          }
                                        }}
                                      />
                                    </VStack>
                            </FormControl>
                                  <FormControl display="flex" alignItems="center">
                                    <FormLabel mb="0">تفعيل طريقة الدفع</FormLabel>
                              <Switch
                                      isChecked={method.isActive}
                                      onChange={(e) => handlePaymentMethodChange(index, 'isActive', e.target.checked)}
                              />
                            </FormControl>
                              <Button
                                colorScheme="red"
                                variant="ghost"
                                onClick={() => {
                                  const updatedMethods = [...localSettings.paymentMethods];
                                  updatedMethods.splice(index, 1);
                                  setLocalSettings({
                                    ...localSettings,
                                    paymentMethods: updatedMethods
                                  });
                                }}
                              >
                                      حذف
                                    </Button>
                                  </SimpleGrid>
                                </Box>
                              ))
                            )}
                            <Button
                              leftIcon={<Plus />}
                              onClick={() => {
                                const newMethod = {
                                  bankId: '',
                                  accountNumber: '',
                                  accountName: '',
                                  isActive: true
                                };
                                setLocalSettings({
                                  ...localSettings,
                                  paymentMethods: [...(localSettings?.paymentMethods || []), newMethod]
                                });
                              }}
                            >
                              إضافة طريقة دفع جديدة
                              </Button>
                            </VStack>
                      </TabPanel>

                      {/* Home Page Settings */}
                      <TabPanel>
                        <VStack spacing={6} align="stretch">
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <FormControl>
                              <FormLabel>عنوان البطل</FormLabel>
                              <Input
                                value={localSettings?.homePage?.heroTitle || ''}
                                onChange={(e) => handleSettingChange('homePage.heroTitle', e.target.value)}
                                placeholder="عنوان البطل"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>وصف البطل</FormLabel>
                              <Textarea
                                value={localSettings?.homePage?.heroDescription || ''}
                                onChange={(e) => handleSettingChange('homePage.heroDescription', e.target.value)}
                                placeholder="وصف البطل"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>عنوان العقارات المميزة</FormLabel>
                              <Input
                                value={localSettings?.homePage?.featuredPropertiesTitle || ''}
                                onChange={(e) => handleSettingChange('homePage.featuredPropertiesTitle', e.target.value)}
                                placeholder="عنوان العقارات المميزة"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>وصف العقارات المميزة</FormLabel>
                              <Textarea
                                value={localSettings?.homePage?.featuredPropertiesDescription || ''}
                                onChange={(e) => handleSettingChange('homePage.featuredPropertiesDescription', e.target.value)}
                                placeholder="وصف العقارات المميزة"
                              />
                            </FormControl>
                          </SimpleGrid>
                        </VStack>
                      </TabPanel>

                      {/* About Page Settings */}
                      <TabPanel>
                        <VStack spacing={6} align="stretch">
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <FormControl>
                              <FormLabel>عنوان البطل</FormLabel>
                              <Input
                                value={localSettings?.aboutPage?.heroTitle || ''}
                                onChange={(e) => handleSettingChange('aboutPage.heroTitle', e.target.value)}
                                placeholder="عنوان البطل"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>وصف البطل</FormLabel>
                              <Textarea
                                value={localSettings?.aboutPage?.heroDescription || ''}
                                onChange={(e) => handleSettingChange('aboutPage.heroDescription', e.target.value)}
                                placeholder="وصف البطل"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>عنوان القصة</FormLabel>
                              <Input
                                value={localSettings?.aboutPage?.storyTitle || ''}
                                onChange={(e) => handleSettingChange('aboutPage.storyTitle', e.target.value)}
                                placeholder="عنوان القصة"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>محتوى القصة</FormLabel>
                              <Textarea
                                value={localSettings?.aboutPage?.storyContent || ''}
                                onChange={(e) => handleSettingChange('aboutPage.storyContent', e.target.value)}
                                placeholder="محتوى القصة"
                              />
                            </FormControl>
                          </SimpleGrid>
                        </VStack>
                      </TabPanel>

                      {/* Contact Page Settings */}
                      <TabPanel>
                        <VStack spacing={6} align="stretch">
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <FormControl>
                              <FormLabel>العنوان</FormLabel>
                              <Input
                                value={localSettings?.contactPage?.title || ''}
                                onChange={(e) => handleSettingChange('contactPage.title', e.target.value)}
                                placeholder="العنوان"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>الوصف</FormLabel>
                              <Textarea
                                value={localSettings?.contactPage?.description || ''}
                                onChange={(e) => handleSettingChange('contactPage.description', e.target.value)}
                                placeholder="الوصف"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>العنوان الفعلي</FormLabel>
                              <Input
                                value={localSettings?.contactPage?.address || ''}
                                onChange={(e) => handleSettingChange('contactPage.address', e.target.value)}
                                placeholder="العنوان الفعلي"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>رقم الهاتف</FormLabel>
                              <Input
                                value={localSettings?.contactPage?.phone || ''}
                                onChange={(e) => handleSettingChange('contactPage.phone', e.target.value)}
                                placeholder="رقم الهاتف"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>البريد الإلكتروني</FormLabel>
                              <Input
                                value={localSettings?.contactPage?.email || ''}
                                onChange={(e) => handleSettingChange('contactPage.email', e.target.value)}
                                placeholder="البريد الإلكتروني"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>رابط الخريطة</FormLabel>
                              <Input
                                value={localSettings?.contactPage?.mapEmbedUrl || ''}
                                onChange={(e) => handleSettingChange('contactPage.mapEmbedUrl', e.target.value)}
                                placeholder="رابط الخريطة"
                              />
                            </FormControl>
                          </SimpleGrid>
                        </VStack>
                      </TabPanel>

                      {/* Banner Settings */}
                      <TabPanel>
                        <VStack spacing={8}>
                          <Box>
                            <Heading size="md" mb={4}>إعدادات البانرات</Heading>
                            
                            {/* Home Page Banners */}
                            <Box mb={8}>
                              <Heading size="sm" mb={4}>بانرات الصفحة الرئيسية</Heading>
                              <VStack spacing={4}>
                                {localSettings?.banners?.home && Object.entries(localSettings.banners.home).map(([key, banner]) => (
                                  <BannerCard key={key} pageType="home" bannerKey={key} banner={banner} />
                                ))}
                                <Button onClick={() => handleAddBanner('home')}>
                                  إضافة بانر جديد للصفحة الرئيسية
                                </Button>
                              </VStack>
                            </Box>

                            {/* About Page Banners */}
                            <Box mb={8}>
                              <Heading size="sm" mb={4}>بانرات صفحة من نحن</Heading>
                              <VStack spacing={4}>
                                {localSettings?.banners?.about && (
                                  <BannerCard pageType="about" bannerKey="about" banner={localSettings.banners.about} />
                                )}
                              </VStack>
                            </Box>

                            {/* Contact Page Banners */}
                            <Box mb={8}>
                              <Heading size="sm" mb={4}>بانرات صفحة اتصال</Heading>
                              <VStack spacing={4}>
                                {localSettings?.banners?.contact && (
                                  <BannerCard pageType="contact" bannerKey="contact" banner={localSettings.banners.contact} />
                                )}
                              </VStack>
                            </Box>
                          </Box>
                        </VStack>
                      </TabPanel>

                      {/* Social Media Settings */}
                      <TabPanel>
                        <VStack spacing={6} align="stretch">
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <FormControl>
                              <FormLabel>رابط فيسبوك</FormLabel>
                              <Input
                                value={localSettings?.socialMedia?.facebook || ''}
                                onChange={(e) => handleSettingChange('socialMedia.facebook', e.target.value)}
                                placeholder="رابط فيسبوك"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>رابط تويتر</FormLabel>
                              <Input
                                value={localSettings?.socialMedia?.twitter || ''}
                                onChange={(e) => handleSettingChange('socialMedia.twitter', e.target.value)}
                                placeholder="رابط تويتر"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>رابط إنستغرام</FormLabel>
                              <Input
                                value={localSettings?.socialMedia?.instagram || ''}
                                onChange={(e) => handleSettingChange('socialMedia.instagram', e.target.value)}
                                placeholder="رابط إنستغرام"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>رابط لينكد إن</FormLabel>
                              <Input
                                value={localSettings?.socialMedia?.linkedin || ''}
                                onChange={(e) => handleSettingChange('socialMedia.linkedin', e.target.value)}
                                placeholder="رابط لينكد إن"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>رابط واتساب</FormLabel>
                              <Input
                                value={localSettings?.socialMedia?.whatsapp || ''}
                                onChange={(e) => handleSettingChange('socialMedia.whatsapp', e.target.value)}
                                placeholder="رابط واتساب"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>رابط يوتيوب</FormLabel>
                              <Input
                                value={localSettings?.socialMedia?.youtube || ''}
                                onChange={(e) => handleSettingChange('socialMedia.youtube', e.target.value)}
                                placeholder="رابط يوتيوب"
                              />
                            </FormControl>
                          </SimpleGrid>
                        </VStack>
                      </TabPanel>

                      {/* Existing Site Settings */}
                      <TabPanel>
                        <VStack spacing={6} align="stretch">
                          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                            <FormControl>
                              <FormLabel>اسم الموقع</FormLabel>
                              <Input
                                value={localSettings?.siteName || ''}
                                onChange={(e) => handleSettingChange('siteName', e.target.value)}
                                placeholder="اسم الموقع"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>وصف الموقع</FormLabel>
                              <Input
                                value={localSettings?.siteDescription || ''}
                                onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                                placeholder="وصف الموقع"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>البريد الإلكتروني للاتصال</FormLabel>
                              <Input
                                value={localSettings?.contactEmail || ''}
                                onChange={(e) => handleSettingChange('contactEmail', e.target.value)}
                                placeholder="البريد الإلكتروني للاتصال"
                              />
                            </FormControl>
                            <FormControl>
                              <FormLabel>رقم الهاتف للاتصال</FormLabel>
                              <Input
                                value={localSettings?.contactPhone || ''}
                                onChange={(e) => handleSettingChange('contactPhone', e.target.value)}
                                placeholder="رقم الهاتف للاتصال"
                              />
                            </FormControl>
                          </SimpleGrid>
                        </VStack>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                          
                          <Button
                    colorScheme="blue"
                    isLoading={isSavingSettings}
                            onClick={() => {
                      console.log('Save button clicked');
                      handleSaveSettings();
                    }}
                    width="full"
                    mt={4}
                  >
                    حفظ الإعدادات
                          </Button>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        </Grid>
      </MotionBox>

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Add Points Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>إضافة نقاط</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6}>
              <FormControl>
                <FormLabel>عدد النقاط</FormLabel>
                <NumberInput
                  value={pointsToAdd}
                  onChange={(value) => setPointsToAdd(parseInt(value))}
                  min={1}
                  max={1000}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              
              <FormControl>
                <FormLabel>طريقة الدفع</FormLabel>
                <RadioGroup value={selectedPaymentMethod} onChange={setSelectedPaymentMethod}>
                  <VStack spacing={4} align="stretch">
                    {mockPaymentMethods.map((method) => (
                      <Box
                        key={method.id}
                        p={4}
                        borderWidth="1px"
                        borderRadius="lg"
                        cursor="pointer"
                        onClick={() => setSelectedPaymentMethod(method.id)}
                        bg={selectedPaymentMethod === method.id ? 'green.50' : 'transparent'}
                        borderColor={selectedPaymentMethod === method.id ? 'green.500' : 'gray.200'}
                        _hover={{ borderColor: 'green.500' }}
                      >
                        <HStack spacing={4}>
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="medium">{method.name}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {method.accountName} - {method.accountNumber}
                            </Text>
                          </VStack>
                          <Radio
                            value={method.id}
                            isChecked={selectedPaymentMethod === method.id}
                            ml="auto"
                          />
                        </HStack>
                      </Box>
                    ))}
                  </VStack>
                </RadioGroup>
              </FormControl>
              
              <FormControl>
                <FormLabel>صورة إثبات الدفع</FormLabel>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPaymentScreenshot(e.target.files[0])}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              إلغاء
            </Button>
            <Button
              colorScheme="primary"
              isDisabled={!selectedPaymentMethod || !paymentScreenshot}
              onClick={() => {
                toast({
                  title: 'تم إضافة النقاط بنجاح',
                  status: 'success',
                  duration: 3000,
                  isClosable: true,
                });
                onClose();
              }}
            >
              إضافة النقاط
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Transaction Modal */}
      <Modal isOpen={isViewTransactionOpen} onClose={onViewTransactionClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth="1px" pb={4}>تفاصيل العملية</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            {selectedTransaction && (
              <VStack spacing={6} align="stretch">
                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={4}>معلومات البائع</Text>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text color="gray.500" fontSize="sm">الاسم</Text>
                      <Text fontWeight="medium">{selectedTransaction.sellerName}</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500" fontSize="sm">البريد الإلكتروني</Text>
                      <Text fontWeight="medium">{selectedTransaction.sellerEmail}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>
                
                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={4}>تفاصيل العملية</Text>
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text color="gray.500" fontSize="sm">المبلغ</Text>
                      <Text fontWeight="medium" color="green.500">{selectedTransaction.amount} أوقية</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500" fontSize="sm">عدد النقاط</Text>
                      <Text fontWeight="medium">{selectedTransaction.points} نقطة</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500" fontSize="sm">طريقة الدفع</Text>
                      <Text fontWeight="medium">{selectedTransaction.paymentMethod}</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500" fontSize="sm">التاريخ</Text>
                      <Text fontWeight="medium">{selectedTransaction.date}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>

                {selectedTransaction.screenshot && (
                  <Box>
                    <Text fontWeight="bold" fontSize="lg" mb={4}>صورة الدفع</Text>
                    <Box
                      borderRadius="lg"
                      overflow="hidden"
                      boxShadow="md"
                      cursor="pointer"
                      onClick={() => window.open(selectedTransaction.screenshot, '_blank')}
                      transition="transform 0.2s"
                      _hover={{ transform: 'scale(1.02)' }}
                    >
                      <Image 
                        src={selectedTransaction.screenshot} 
                        alt="صورة الدفع"
                        width="100%"
                        objectFit="cover"
                      />
                    </Box>
                  </Box>
                )}

                <Box>
                  <Text fontWeight="bold" fontSize="lg" mb={4}>الإجراءات</Text>
                  <HStack spacing={4}>
                    <Button
                      leftIcon={<CheckCircle size={20} />}
                      colorScheme="green"
                      onClick={() => {
                        onViewTransactionClose();
                        handleApproveTransaction(selectedTransaction);
                      }}
                    >
                      موافقة
                    </Button>
                    <Button
                      leftIcon={<XCircle size={20} />}
                      colorScheme="red"
                      onClick={() => {
                        onViewTransactionClose();
                        handleRejectTransaction(selectedTransaction);
                      }}
                    >
                      رفض
                    </Button>
                  </HStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Approve Transaction Modal */}
      <Modal isOpen={isApproveTransactionOpen} onClose={onApproveTransactionClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth="1px" pb={4}>تأكيد الموافقة</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <VStack spacing={6} align="stretch">
              <Box textAlign="center">
                <Icon as={CheckCircle} w={12} h={12} color="green.500" mb={4} />
                <Text fontSize="lg" fontWeight="medium">هل أنت متأكد من الموافقة على عملية شراء النقاط هذه؟</Text>
              </Box>
              
              {selectedTransaction && (
                <Box bg="gray.50" p={4} borderRadius="lg">
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text color="gray.500" fontSize="sm">البائع</Text>
                      <Text fontWeight="medium">{selectedTransaction.sellerName}</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500" fontSize="sm">المبلغ</Text>
                      <Text fontWeight="medium" color="green.500">{selectedTransaction.amount} أوقية</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500" fontSize="sm">عدد النقاط</Text>
                      <Text fontWeight="medium">{selectedTransaction.points} نقطة</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500" fontSize="sm">طريقة الدفع</Text>
                      <Text fontWeight="medium">{selectedTransaction.paymentMethod}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter borderTopWidth="1px" pt={4}>
            <Button variant="ghost" mr={3} onClick={onApproveTransactionClose}>
              إلغاء
            </Button>
            <Button
              leftIcon={<CheckCircle size={20} />}
              colorScheme="green"
              onClick={handleConfirmApprove}
            >
              تأكيد الموافقة
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Reject Transaction Modal */}
      <Modal isOpen={isRejectTransactionOpen} onClose={onRejectTransactionClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottomWidth="1px" pb={4}>تأكيد الرفض</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <VStack spacing={6} align="stretch">
              <Box textAlign="center">
                <Icon as={XCircle} w={12} h={12} color="red.500" mb={4} />
                <Text fontSize="lg" fontWeight="medium">هل أنت متأكد من رفض عملية شراء النقاط هذه؟</Text>
              </Box>
              
              {selectedTransaction && (
                <Box bg="gray.50" p={4} borderRadius="lg">
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text color="gray.500" fontSize="sm">البائع</Text>
                      <Text fontWeight="medium">{selectedTransaction.sellerName}</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500" fontSize="sm">المبلغ</Text>
                      <Text fontWeight="medium" color="green.500">{selectedTransaction.amount} أوقية</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500" fontSize="sm">عدد النقاط</Text>
                      <Text fontWeight="medium">{selectedTransaction.points} نقطة</Text>
                    </Box>
                    <Box>
                      <Text color="gray.500" fontSize="sm">طريقة الدفع</Text>
                      <Text fontWeight="medium">{selectedTransaction.paymentMethod}</Text>
                    </Box>
                  </SimpleGrid>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter borderTopWidth="1px" pt={4}>
            <Button variant="ghost" mr={3} onClick={onRejectTransactionClose}>
              إلغاء
            </Button>
            <Button
              leftIcon={<XCircle size={20} />}
              colorScheme="red"
              onClick={handleConfirmReject}
            >
              تأكيد الرفض
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View User Modal */}
      <Modal isOpen={isViewUserOpen} onClose={onViewUserClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>معلومات المستخدم</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <VStack spacing={4} align="stretch">
                <HStack>
                  <Avatar size="xl" name={selectedUser.name} src={selectedUser.avatar} />
                  <VStack align="start" spacing={1}>
                    <Text fontSize="xl" fontWeight="bold">{selectedUser.name}</Text>
                    <Text color="gray.500">رقم الهاتف: {selectedUser.phone}</Text>
                    <Badge colorScheme={selectedUser.role === 'admin' ? 'purple' : 'blue'}>
                      {selectedUser.role === 'admin' ? 'مدير' : 'بائع'}
                    </Badge>
                  </VStack>
                </HStack>
                
                <Divider />
                
                <SimpleGrid columns={2} spacing={4}>
                  <Box>
                    <Text fontWeight="bold">عدد العقارات</Text>
                    <Text>{selectedUser.properties?.length || 0}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">تاريخ التسجيل</Text>
                    <Text>{selectedUser.date}</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">الحالة</Text>
                    <Badge colorScheme={selectedUser.isActive ? 'green' : 'red'}>
                      {selectedUser.isActive ? 'نشط' : 'محظور'}
                    </Badge>
                  </Box>
                  <Box>
                    <Text fontWeight="bold">رقم الهاتف</Text>
                    <Text>{selectedUser.phone}</Text>
                  </Box>
                </SimpleGrid>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onViewUserClose}>
              إغلاق
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={isEditUserOpen} onClose={onEditUserClose} size={{ base: "full", md: "lg" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>تعديل معلومات المستخدم</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>الاسم</FormLabel>
                  <Input 
                    value={selectedUser.name}
                    onChange={(e) => setSelectedUser({...selectedUser, name: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <Input 
                    value={selectedUser.email}
                    type="email"
                    onChange={(e) => setSelectedUser({...selectedUser, email: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <Input 
                    value={selectedUser.phone}
                    type="tel"
                    onChange={(e) => setSelectedUser({...selectedUser, phone: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>رقم الواتساب</FormLabel>
                  <Input 
                    value={selectedUser.whatsapp}
                    type="tel"
                    onChange={(e) => setSelectedUser({...selectedUser, whatsapp: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>اسم الشركة</FormLabel>
                  <Input 
                    value={selectedUser.company}
                    onChange={(e) => setSelectedUser({...selectedUser, company: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>العنوان</FormLabel>
                  <Input 
                    value={selectedUser.address}
                    onChange={(e) => setSelectedUser({...selectedUser, address: e.target.value})}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>الدور</FormLabel>
                  <Select 
                    value={selectedUser.role}
                    onChange={(e) => setSelectedUser({...selectedUser, role: e.target.value})}
                  >
                    <option value="seller">بائع</option>
                    <option value="admin">مدير</option>
                    <option value="superadmin">مدير أعلى</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>الحالة</FormLabel>
                  <Select 
                    value={selectedUser.isActive ? 'active' : 'banned'}
                    onChange={(e) => setSelectedUser({...selectedUser, isActive: e.target.value === 'active'})}
                  >
                    <option value="active">نشط</option>
                    <option value="banned">محظور</option>
                  </Select>
                </FormControl>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={async () => {
              try {
                const response = await updateUser(selectedUser._id, selectedUser);
                
                if (response.success) {
              setUsers(prevUsers => 
                prevUsers.map(u => 
                      u._id === selectedUser._id 
                        ? response.user 
                    : u
                )
              );
              
              toast({
                title: "تم تحديث المستخدم",
                description: "تم تحديث معلومات المستخدم بنجاح",
                status: "success",
                duration: 3000,
                isClosable: true,
              });
                } else {
                  toast({
                    title: "خطأ",
                    description: response.error || "حدث خطأ أثناء تحديث المستخدم",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                  });
                }
              } catch (err) {
                toast({
                  title: "خطأ",
                  description: "حدث خطأ أثناء تحديث المستخدم",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              }
              
              onEditUserClose();
            }}>
              حفظ التغييرات
            </Button>
            <Button variant="ghost" onClick={onEditUserClose}>
              إلغاء
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Ban User Modal */}
      <Modal isOpen={isBanUserOpen} onClose={onBanUserClose} size={{ base: "full", md: "md" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>حظر المستخدم</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedUser && (
              <VStack spacing={4}>
                <Icon as={Ban} w={12} h={12} color="red.500" />
                <Text textAlign="center">
                  هل أنت متأكد من رغبتك في حظر المستخدم {selectedUser.name}؟ 
                  لن يتمكن المستخدم من تسجيل الدخول بعد الحظر.
                </Text>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleConfirmBan}>
              تأكيد الحظر
            </Button>
            <Button variant="ghost" onClick={onBanUserClose}>
              إلغاء
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* View Property Modal */}
      <Modal isOpen={isViewPropertyOpen} onClose={onViewPropertyClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>تفاصيل العقار</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedProperty && (
              <VStack spacing={6} align="stretch">
                {selectedProperty.images && selectedProperty.images.length > 0 && (
                  <Box>
                    <Text fontWeight="bold" mb={2}>الصور والفيديوهات</Text>
                    <SimpleGrid columns={3} spacing={4}>
                      {selectedProperty.images.map((media, index) => (
                        <Box key={index}>
                          {media.includes('.mp4') ? (
                            <video
                              src={media}
                              controls
                              style={{ width: '100%', borderRadius: '8px' }}
                            />
                          ) : (
                            <Image
                              src={media}
                              alt={`صورة ${index + 1}`}
                              w="100%"
                              h="200px"
                              objectFit="cover"
                              borderRadius="lg"
                            />
                          )}
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}
                
                <VStack align="stretch" spacing={4}>
                  <Box>
                    <Text fontSize="2xl" fontWeight="bold">{selectedProperty.title}</Text>
                    <Text color="gray.500">{selectedProperty.location}</Text>
                  </Box>
                  
                  <SimpleGrid columns={2} spacing={4}>
                    <Box>
                      <Text fontWeight="bold">السعر</Text>
                      <Text>{selectedProperty.price} أوقية</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">النوع</Text>
                      <Text>{selectedProperty.propertyType}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">المساحة</Text>
                      <Text>{selectedProperty.area} م²</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="bold">عدد الغرف</Text>
                      <Text>{selectedProperty.bedrooms}</Text>
                    </Box>
                  </SimpleGrid>
                  
                  <Box>
                    <Text fontWeight="bold">الوصف</Text>
                    <Text>{selectedProperty.description}</Text>
                  </Box>
                  
                  <Box>
                    <Text fontWeight="bold">معلومات البائع</Text>
                    <Box bg="gray.50" p={4} borderRadius="lg">
                      <VStack align="start" spacing={2}>
                        <Text>الاسم: {selectedProperty.createdBy?.name || 'غير معروف'}</Text>
                        <Text>البريد الإلكتروني: {selectedProperty.createdBy?.email || 'غير معروف'}</Text>
                        <Text>رقم الهاتف: {selectedProperty.createdBy?.phone || 'غير معروف'}</Text>
                      </VStack>
                    </Box>
                  </Box>
                </VStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onViewPropertyClose}>
              إغلاق
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Update the Reject Property Modal */}
      <Modal isOpen={isRejectPropertyOpen} onClose={onRejectPropertyClose} size={{ base: "full", md: "md" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>تأكيد الرفض</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedProperty && (
              <VStack spacing={4}>
                <Icon as={XCircle} w={12} h={12} color="red.500" />
                <Text textAlign="center">
                  هل أنت متأكد من رفض عقار {selectedProperty.title}؟
                  سيتم إبلاغ البائع برفض العقار.
                </Text>
                
                <Box w="full" p={4} bg="gray.50" borderRadius="lg">
                  <Text fontWeight="bold" mb={2}>معلومات البائع:</Text>
                  <VStack align="start" spacing={1}>
                    <Text>الاسم: {selectedProperty.createdBy?.name || 'غير معروف'}</Text>
                    <Text>البريد الإلكتروني: {selectedProperty.createdBy?.email || 'غير معروف'}</Text>
                    <Text>رقم الهاتف: {selectedProperty.createdBy?.phone || 'غير معروف'}</Text>
                  </VStack>
                </Box>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={handleConfirmPropertyReject}>
              تأكيد الرفض
            </Button>
            <Button variant="ghost" onClick={onRejectPropertyClose}>
              إلغاء
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add User Modal */}
      <Modal isOpen={isAddUserOpen} onClose={onAddUserClose} size={{ base: "full", md: "lg" }}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>إضافة مستخدم جديد</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>الاسم</FormLabel>
                <Input 
                  value={newUser.name}
                  onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                  placeholder="أدخل الاسم الكامل"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>البريد الإلكتروني</FormLabel>
                <Input 
                  value={newUser.email}
                  type="email"
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                  placeholder="أدخل البريد الإلكتروني"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>كلمة المرور</FormLabel>
                <Input 
                  value={newUser.password}
                  type="password"
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                  placeholder="أدخل كلمة المرور"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>رقم الهاتف</FormLabel>
                <Input 
                  value={newUser.phone}
                  type="tel"
                  onChange={(e) => setNewUser({...newUser, phone: e.target.value})}
                  placeholder="أدخل رقم الهاتف"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>رقم الواتساب</FormLabel>
                <Input 
                  value={newUser.whatsapp}
                  type="tel"
                  onChange={(e) => setNewUser({...newUser, whatsapp: e.target.value})}
                  placeholder="أدخل رقم الواتساب"
                />
              </FormControl>
              <FormControl>
                <FormLabel>اسم الشركة</FormLabel>
                <Input 
                  value={newUser.company}
                  onChange={(e) => setNewUser({...newUser, company: e.target.value})}
                  placeholder="أدخل اسم الشركة"
                />
              </FormControl>
              <FormControl>
                <FormLabel>العنوان</FormLabel>
                <Input 
                  value={newUser.address}
                  onChange={(e) => setNewUser({...newUser, address: e.target.value})}
                  placeholder="أدخل العنوان"
                />
              </FormControl>
              <FormControl>
                <FormLabel>الدور</FormLabel>
                <Select 
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="seller">بائع</option>
                  <option value="admin">مدير</option>
                  <option value="superadmin">مدير أعلى</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>الحالة</FormLabel>
                <Select 
                  value={newUser.status}
                  onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                >
                  <option value="active">نشط</option>
                  <option value="pending">قيد المراجعة</option>
                  <option value="banned">محظور</option>
                </Select>
              </FormControl>
              </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleAddUserSubmit}>
              إضافة
            </Button>
            <Button variant="ghost" onClick={onAddUserClose}>
              إلغاء
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

    </Container>
  );
};

export default AdminDashboard; 
