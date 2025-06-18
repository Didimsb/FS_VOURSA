import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  SimpleGrid,
  Heading,
  Text,
  useColorModeValue,
  Button,
  HStack,
  VStack,
  Spinner,
  Center,
  Icon,
  Flex,
  Wrap,
  WrapItem,
  Tooltip,
  ButtonGroup,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import { Building2, LandPlot } from 'lucide-react';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import BannerSlider from '../components/BannerSlider';
import Footer from '../components/Footer';
import { useSettings } from '../context/SettingsContext';
import { getAllProperties, getAllPropertyTypes } from '../services/PropertyService';

const MotionBox = motion(Box);

const propertyTypeIcons = {
  'أرض للبيع': LandPlot,
  'منزل للبيع': FaHome,
  'منزل للايجار': FaHome,
  'شقة للايجار': Building2
  
};

const Home = () => {
  const { settings, loading: settingsLoading } = useSettings();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const bgColor = useColorModeValue('white', 'gray.800');
  const containerBg = useColorModeValue('gray.50', 'gray.900');
  const hoverBg = useColorModeValue('yellow.50', 'yellow.900');
  const [availablePropertyTypes, setAvailablePropertyTypes] = useState([]);

  // Fetch all property types on component mount
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const types = await getAllPropertyTypes();
        setAvailablePropertyTypes(types);
      } catch (error) {
        console.error('Error fetching property types:', error);
      }
    };
    
    fetchPropertyTypes();
  }, []);

  const fetchProperties = async (pageNum = 1, currentFilters = {}) => {
    try {
      setLoading(true);
      const { properties: fetchedProperties, hasMore: fetchedHasMore, totalPages: fetchedTotalPages } = await getAllProperties(pageNum, 12, currentFilters);
      
      setProperties(fetchedProperties || []);
      setTotalPages(fetchedTotalPages || 1);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(page, filters);
  }, [page, filters]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePropertyTypeClick = (type) => {
    const newSelectedType = type === selectedPropertyType ? null : type;
    setSelectedPropertyType(newSelectedType);
    setFilters(prev => ({
      ...prev,
      propertyType: newSelectedType
    }));
    setPage(1);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (page <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        if (totalPages > 5) {
          pages.push('...');
          pages.push(totalPages);
        }
      } else if (page >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (settingsLoading) {
    return (
      <Box bg={containerBg} minH="100vh" display="flex" alignItems="center" justifyContent="center">
        <Spinner size="xl" color="yellow.500" />
      </Box>
    );
  }

  return (
    <Box bg={containerBg}>
      <BannerSlider />
      <Hero onSearch={handleSearch} />
      
      <Container maxW="container.xl" py={16}>
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box textAlign="center" mb={12}>
            <Heading
              as="h2"
              size="xl"
              bgGradient="linear(to-r, yellow.400, yellow.600)"
              bgClip="text"
            >
              {settings?.homePage?.featuredPropertiesTitle || 'أحدث العقارات'}
            </Heading>
            <Text fontSize="lg" color={textColor}>
              {settings?.homePage?.featuredPropertiesDescription || 'اكتشف مجموعة متنوعة من العقارات المميزة في أفضل المواقع'}
            </Text>
          </Box>

          {/* Property Type Filter */}
          <Box mb={8}>
            <Heading size="md" mb={4} textAlign="center">اختر نوع العقار</Heading>
            <Wrap spacing={4} justify="center">
              {availablePropertyTypes.map((type) => {
                const IconComponent = propertyTypeIcons[type] || FaHome; // Fallback to FaHome if icon not found
                return (
                  <WrapItem key={type}>
                    <VStack spacing={2}>
                      <Tooltip label={type} placement="top">
                        <Button
                          size="lg"
                          variant={selectedPropertyType === type ? "solid" : "outline"}
                          colorScheme="yellow"
                          borderRadius="full"
                          minW={16}
                          h={16}
                          p={0}
                          onClick={() => handlePropertyTypeClick(type)}
                          _hover={{
                            transform: 'translateY(-2px)',
                            boxShadow: 'lg'
                          }}
                          transition="all 0.2s"
                        >
                          <Icon as={IconComponent} boxSize={7} />
                        </Button>
                      </Tooltip>
                      <Text fontSize="sm" textAlign="center">{type}</Text>
                    </VStack>
                  </WrapItem>
                );
              })}
            </Wrap>
          </Box>

          {loading ? (
            <Center py={10}>
              <Spinner size="xl" color="yellow.500" />
            </Center>
          ) : properties && properties.length > 0 ? (
            <>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
                {properties.map(property => (
                  <PropertyCard key={property._id} property={property} />
                ))}
              </SimpleGrid>

              {/* Pagination */}
              {totalPages > 1 && (
                <Center mt={8}>
                  <ButtonGroup spacing={2} size="md">
                    <Button
                      onClick={() => handlePageChange(page - 1)}
                      isDisabled={page === 1}
                      colorScheme="yellow"
                      variant="outline"
                    >
                      السابق
                    </Button>
                    
                    {getPageNumbers().map((pageNum, index) => (
                      <Button
                        key={index}
                        onClick={() => typeof pageNum === 'number' ? handlePageChange(pageNum) : null}
                        isDisabled={pageNum === '...'}
                        colorScheme={page === pageNum ? "yellow" : "gray"}
                        variant={page === pageNum ? "solid" : "outline"}
                      >
                        {pageNum}
                      </Button>
                    ))}
                    
                    <Button
                      onClick={() => handlePageChange(page + 1)}
                      isDisabled={page === totalPages}
                      colorScheme="yellow"
                      variant="outline"
                    >
                      التالي
                    </Button>
                  </ButtonGroup>
                </Center>
              )}
            </>
          ) : (
            <Text textAlign="center" fontSize="xl" color={textColor}>
              {settings?.homePage?.noPropertiesMessage || 'لا توجد عقارات مميزة متاحة حالياً.'}
            </Text>
          )}

        </MotionBox>
      </Container>
      <Footer />
    </Box>
  );
};

export default Home; 