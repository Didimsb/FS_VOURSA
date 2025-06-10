import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  useColorModeValue,
  Stack,
  Text,
  Link,
  Container,
  Avatar,
  Divider,
  Image,
  Collapse,
  VStack,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from '@chakra-ui/react';
import { HamburgerIcon, CloseIcon, ChevronDownIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const MotionBox = motion(Box);

const Links = [
  { name: 'الرئيسية', path: '/' },
  { name: 'من نحن', path: '/about' },
  { name: 'اتصل بنا', path: '/contact' },
];

const NavLink = ({ children, to, onClick }) => (
  <Link
    as={RouterLink}
    px={2}
    py={1}
    rounded={'md'}
    _hover={{
      textDecoration: 'none',
      bg: useColorModeValue('gray.200', 'gray.700'),
    }}
    to={to}
    onClick={onClick}
  >
    {children}
  </Link>
);

const Navbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();



  // Handle scroll effect
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <MotionBox
      as="nav"
      position="fixed"
      w="100%"
      zIndex="sticky"
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={isScrolled ? 'sm' : 'none'}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Container maxW="container.xl">
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          {/* Logo */}
          <Link as={RouterLink} to="/">
            <Image
              src="/logo.jpg"
              alt="وكالة ورسة"
              h={{ base: "60px", md: "60px" }}
              objectFit="contain"
              transition="all 0.3s ease"
              _hover={{ transform: 'scale(1.05)' }}
            />
          </Link>

          {/* Desktop Navigation */}
          <HStack spacing={8} alignItems={'center'} display={{ base: 'none', md: 'flex' }}>
            <NavLink to="/">الرئيسية</NavLink>
            <NavLink to="/about">من نحن</NavLink>
            <NavLink to="/contact">اتصل بنا</NavLink>
            
            {isAuthenticated ? (
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  variant="ghost"
                  size="sm"
                >
                  <HStack spacing={2}>
                    <Avatar size="sm" name={user?.name} />
                    <Text>{user?.name}</Text>
                  </HStack>
                </MenuButton>
                <MenuList>
                  {user?.role === 'admin' || user?.role === 'superadmin' ? (
                    <>
                      <MenuItem as={RouterLink} to="/admin/dashboard">
                        لوحة تحكم المدير
                      </MenuItem>
                      <MenuItem as={RouterLink} to="/seller-dashboard">
                        لوحة تحكم البائع
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout}>تسجيل الخروج</MenuItem>
                    </>
                  ) : user?.role === 'seller' ? (
                    <>
                      <MenuItem as={RouterLink} to="/seller-dashboard">
                        لوحة تحكم البائع
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleLogout}>تسجيل الخروج</MenuItem>
                    </>
                  ) : (
                    <MenuItem onClick={handleLogout}>تسجيل الخروج</MenuItem>
                  )}
                </MenuList>
              </Menu>
            ) : (
              <Button
                as={RouterLink}
                to="/seller-login"
                variant={'solid'}
                colorScheme={'yellow'}
                size={'sm'}
              >
                تسجيل الدخول
              </Button>
            )}
          </HStack>

          {/* Mobile menu button */}
          <HStack spacing={2} display={{ base: 'flex', md: 'none' }}>
            <IconButton
              size={'md'}
              icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
              aria-label={'Open Menu'}
              onClick={isOpen ? onClose : onOpen}
            />
          </HStack>
        </Flex>

        {/* Mobile Navigation */}
        {isOpen && (
          <Box pb={4} display={{ base: 'block', md: 'none' }}>
            <Stack as={'nav'} spacing={4}>
              <NavLink to="/" onClick={onClose}>الرئيسية</NavLink>
              <NavLink to="/about" onClick={onClose}>من نحن</NavLink>
              <NavLink to="/contact" onClick={onClose}>اتصل بنا</NavLink>
              
              {isAuthenticated ? (
                <>
                  <Divider />
                  <Text fontWeight="bold" px={2}>
                    {user?.name}
                  </Text>
                  {user?.role === 'admin' || user?.role === 'superadmin' ? (
                    <>
                      <NavLink to="/admin/dashboard" onClick={onClose}>لوحة تحكم المدير</NavLink>
                      <NavLink to="/seller-dashboard" onClick={onClose}>لوحة تحكم البائع</NavLink>
                    </>
                  ) : user?.role === 'seller' ? (
                    <NavLink to="/seller-dashboard" onClick={onClose}>لوحة تحكم البائع</NavLink>
                  ) : null}
                  <NavLink to={user?.role === 'admin' ? '/admin/profile' : '/seller/profile'} onClick={onClose}>
                    الملف الشخصي
                  </NavLink>
                  <Button
                    variant="outline"
                    colorScheme="red"
                    onClick={() => {
                      handleLogout();
                      onClose();
                    }}
                    w="full"
                  >
                    تسجيل الخروج
                  </Button>
                </>
              ) : (
                <Button
                  as={RouterLink}
                  to="/seller-login"
                  variant={'solid'}
                  colorScheme={'yellow'}
                  size={'sm'}
                  w="full"
                  onClick={onClose}
                >
                  تسجيل الدخول
                </Button>
              )}
            </Stack>
          </Box>
        )}
      </Container>
    </MotionBox>
  );
};

export default Navbar; 