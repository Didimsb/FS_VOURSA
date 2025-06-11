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
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import { Building2, LandPlot } from 'lucide-react';
import Hero from '../components/Hero';
import PropertyCard from '../components/PropertyCard';
import BannerSlider from '../components/BannerSlider';
import Footer from '../components/Footer';
import { useSettings } from '../context/SettingsContext';
import { getAllProperties } from '../services/PropertyService';

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
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({});
  const [selectedPropertyType, setSelectedPropertyType] = useState(null);
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const bgColor = useColorModeValue('white', 'gray.800');
  const containerBg = useColorModeValue('gray.50', 'gray.900');
  const hoverBg = useColorModeValue('yellow.50', 'yellow.900');
  const [availablePropertyTypes, setAvailablePropertyTypes] = useState([]);

  const fetchProperties = async (pageNum = 1, currentFilters = {}) => {
    try {
      setLoading(true);
      const { properties: fetchedProperties, hasMore: fetchedHasMore } = await getAllProperties(pageNum, 10);
      
      // Get unique property types from fetched properties
      const uniqueTypes = [...new Set(fetchedProperties.map(property => property.propertyType))];
      setAvailablePropertyTypes(uniqueTypes);
      
      // Apply filters
      let filteredProperties = fetchedProperties || [];
      
      if (currentFilters.propertyType) {
        filteredProperties = filteredProperties.filter(
          property => property.propertyType === currentFilters.propertyType
        );
      }
      
      if (currentFilters.province) {
        filteredProperties = filteredProperties.filter(
          property => property.province === currentFilters.province
        );
      }
      
      if (currentFilters.district) {
        filteredProperties = filteredProperties.filter(
          property => property.district === currentFilters.district
        );
      }
      
      if (currentFilters.minPrice) {
        filteredProperties = filteredProperties.filter(
          property => property.price >= parseInt(currentFilters.minPrice)
        );
      }
      
      if (currentFilters.maxPrice) {
        filteredProperties = filteredProperties.filter(
          property => property.price <= parseInt(currentFilters.maxPrice)
        );
      }
      
      // Apply sorting
      if (currentFilters.sortBy) {
        switch (currentFilters.sortBy) {
          case 'newest':
            filteredProperties.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'oldest':
            filteredProperties.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
          case 'price_low':
            filteredProperties.sort((a, b) => a.price - b.price);
            break;
          case 'price_high':
            filteredProperties.sort((a, b) => b.price - a.price);
            break;
          case 'space_low':
            filteredProperties.sort((a, b) => a.area - b.area);
            break;
          case 'space_high':
            filteredProperties.sort((a, b) => b.area - a.area);
            break;
          default:
            break;
        }
      }
      
      setProperties(prev => pageNum === 1 ? filteredProperties : [...prev, ...filteredProperties]);
      setHasMore(fetchedHasMore && filteredProperties.length === 10);
    } catch (error) {
      console.error('Error fetching properties:', error);
      setProperties([]);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties(1, filters);
  }, [filters]);

  const handleSearch = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProperties(nextPage, filters);
  };

  const handlePropertyTypeClick = (type) => {
    setSelectedPropertyType(type === selectedPropertyType ? null : type);
    setFilters(prev => ({
      ...prev,
      propertyType: type === selectedPropertyType ? null : type
    }));
    setPage(1);
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

          {loading && page === 1 ? (
            <Center py={10}>
              <Spinner size="xl" color="yellow.500" />
            </Center>
          ) : properties && properties.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {properties.map(property => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </SimpleGrid>
          ) : (
            <Text textAlign="center" fontSize="xl" color={textColor}>
              {settings?.homePage?.noPropertiesMessage || 'لا توجد عقارات مميزة متاحة حالياً.'}
            </Text>
          )}

          {hasMore && !loading && properties && properties.length > 0 && (
            <Center mt={8}>
              <Button
                onClick={handleLoadMore}
                isLoading={loading}
                loadingText="تحميل المزيد..."
                colorScheme="yellow"
              >
                تحميل المزيد
              </Button>
            </Center>
          )}

        </MotionBox>
      </Container>
      <Footer />
    </Box>
  );
};

export default Home; 