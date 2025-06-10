import React, { useState } from 'react';
import {
  Box,
  Container,
  Text,
  Button,
  Input,
  Select,
  Stack,
  useColorModeValue,
  HStack,
  InputGroup,
  InputLeftElement,
  Flex,
  Heading,
  Badge,
  VStack,
  Grid,
  GridItem,
  Collapse,
  IconButton,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Search, Home, MapPin, DollarSign, ArrowUpDown, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

const MotionBox = motion(Box);

const provinces = [
  { name: 'ولاية الحوض الشرقي', districts: ['مقاطعة امورج', 'مقاطعة باسكنو', 'مقاطعة جكني', 'مقاطعة النعمة', 'مقاطعة ولاتة', 'مقاطعة تمبدغة'] },
  { name: 'ولاية الحوض الغربي', districts: ['مقاطعة العيون', 'مقاطعة كوبني', 'مقاطعة تامشكط', 'مقاطعة الطينطان'] },
  { name: 'ولاية العصابة', districts: ['مقاطعة باركيول', 'مقاطعة بومديد', 'مقاطعة كرو', 'مقاطعة كنكوصة', 'مقاطعة كيفة'] },
  { name: 'ولاية كوركول', districts: ['مقاطعة كيهيدي', 'مقاطعة امبود', 'مقاطعة مقامه', 'مقاطعة مونكل'] },
  { name: 'ولاية البراكنة', districts: ['مقاطعة ألاك', 'مقاطعة بابابي', 'مقاطعة بوكي', 'مقاطعة امباني', 'مقاطعة مقطع لحجار'] },
  { name: 'ولاية الترارزة', districts: ['مقاطعة بوتلميت', 'مقاطعة كرمسين', 'مقاطعة المذرذره', 'مقاطعة واد الناقة', 'مقاطعة الركيز', 'مقاطعة روصو'] },
  { name: 'ولاية أدرار', districts: ['مقاطعة أطار', 'مقاطعة شنقيط', 'مقاطعة أوجفت', 'مقاطعة وادان'] },
  { name: 'ولاية داخلة نواذيبو', districts: ['مقاطعة نواذيبو', 'مقاطعة الشامي'] },
  { name: 'ولاية تكانت', districts: ['مقاطعة المجرية', 'مقاطعة تيشيت', 'مقاطعة تجكجة'] },
  { name: 'ولاية غيديماغا', districts: ['مقاطعة ولد ينج', 'مقاطعة سيليبابي'] },
  { name: 'ولاية تيرس زمور', districts: ['مقاطعة بير أم اكرين', 'مقاطعة فديرك', 'مقاطعة الزويرات'] },
  { name: 'ولاية إينشيري', districts: ['مقاطعة أكجوجت', 'مقاطعة بنشاب'] },
  { name: 'ولاية نواكشوط الشمالية', districts: ['مقاطعة دار النعيم', 'مقاطعة تيارت', 'مقاطعة توجنين'] },
  { name: 'ولاية نواكشوط الغربية', districts: ['مقاطعة لكصر', 'مقاطعة السبخة', 'مقاطعة تفرغ زينة'] },
  { name: 'ولاية نواكشوط الجنوبية', districts: ['مقاطعة عرفات', 'مقاطعة الميناء', 'مقاطعة الرياض'] }
];

const Hero = ({ onSearch }) => {
  const { settings, loading } = useSettings();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const heroBgColor = useColorModeValue('primary.50', 'gray.900');
  const heroTextColor = useColorModeValue('gray.600', 'gray.300');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [province, setProvince] = useState('');
  const [district, setDistrict] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [availableDistricts, setAvailableDistricts] = useState([]);

  const handleProvinceChange = (e) => {
    const selectedProvince = e.target.value;
    setProvince(selectedProvince);
    setDistrict('');
    const provinceData = provinces.find(p => p.name === selectedProvince);
    setAvailableDistricts(provinceData ? provinceData.districts : []);
  };

  const handleSearch = () => {
    const filters = {
      minPrice,
      maxPrice,
      sortBy,
      propertyType,
      province,
      district
    };
    onSearch(filters);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  if (loading) {
    return null;
  }

  return (
    <Box
      position="relative"
      bg={heroBgColor}
      overflow="hidden"
      py={{ base: 20, md: 32 }}
    >
      {/* Background Pattern */}
      <Box
        position="absolute"
        top={0}
        left={0}
        right={0}
        bottom={0}
        opacity={0.1}
        backgroundImage={`url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`}
      />

      <Container maxW="container.xl">
        <Stack spacing={8} align="center" textAlign="center">
          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading
              as="h1"
              size="2xl"
              bgGradient="linear(to-r, yellow.400, yellow.600)"
              bgClip="text"
              mb={4}
            >
              {settings?.homePage?.heroTitle}
            </Heading>
            <Text
              fontSize={{ base: 'lg', md: 'xl' }}
              color={heroTextColor}
              maxW="2xl"
              mx="auto"
            >
              {settings?.homePage?.heroDescription}
            </Text>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            w="full"
            maxW="5xl"
            mx="auto"
          >
            <Box
              bg={bgColor}
              p={6}
              rounded="xl"
              boxShadow="xl"
              borderWidth="1px"
              borderColor={borderColor}
            >
              <Flex justify="space-between" align="center" mb={4}>
                <Button
                  leftIcon={<Filter size={20} />}
                  rightIcon={showFilters ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  variant="outline"
                  colorScheme="yellow"
                  onClick={toggleFilters}
                >
                  تصفية البحث
                </Button>
              </Flex>
              
              <Collapse in={showFilters} animateOpacity>
                <Box pt={4}>
                  <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                    <GridItem>
                      <VStack align="start" spacing={4}>
                        <Badge colorScheme="yellow" fontSize="sm" px={2} py={1} borderRadius="md">
                          نوع العقار
                        </Badge>
                        <Select
                          placeholder="اختر نوع العقار"
                          icon={<Home size={16} />}
                          size="lg"
                          value={propertyType}
                          onChange={(e) => setPropertyType(e.target.value)}
                        >
                          <option value="منزل للبيع">منزل للبيع</option>
                          <option value="منزل للايجار">منزل للايجار</option>
                          <option value="دوبلكس للبيع">دوبلكس للبيع</option>
                          <option value="دوبلكس للايجار">دوبلكس للايجار</option>
                          <option value="أرض للبيع">أرض للبيع</option>
                        </Select>
                      </VStack>
                    </GridItem>
                    
                    <GridItem>
                      <VStack align="start" spacing={4}>
                        <Badge colorScheme="yellow" fontSize="sm" px={2} py={1} borderRadius="md">
                          الولاية
                        </Badge>
                        <Select
                          placeholder="اختر الولاية"
                          icon={<MapPin size={16} />}
                          size="lg"
                          value={province}
                          onChange={handleProvinceChange}
                        >
                          {provinces.map((province) => (
                            <option key={province.name} value={province.name}>
                              {province.name}
                            </option>
                          ))}
                        </Select>
                      </VStack>
                    </GridItem>
                    
                    <GridItem>
                      <VStack align="start" spacing={4}>
                        <Badge colorScheme="yellow" fontSize="sm" px={2} py={1} borderRadius="md">
                          المقاطعة
                        </Badge>
                        <Select
                          placeholder="اختر المقاطعة"
                          icon={<MapPin size={16} />}
                          size="lg"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          isDisabled={!province}
                        >
                          {availableDistricts.map((district) => (
                            <option key={district} value={district}>
                              {district}
                            </option>
                          ))}
                        </Select>
                      </VStack>
                    </GridItem>
                    
                    <GridItem>
                      <VStack align="start" spacing={4}>
                        <Badge colorScheme="yellow" fontSize="sm" px={2} py={1} borderRadius="md">
                          نطاق السعر
                        </Badge>
                        <HStack spacing={2} width="100%">
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <DollarSign size={16} />
                            </InputLeftElement>
                            <Input
                              placeholder="من"
                              size="lg"
                              value={minPrice}
                              onChange={(e) => setMinPrice(e.target.value)}
                            />
                          </InputGroup>
                          <Text fontWeight="bold">-</Text>
                          <InputGroup>
                            <InputLeftElement pointerEvents="none">
                              <DollarSign size={16} />
                            </InputLeftElement>
                            <Input
                              placeholder="إلى"
                              size="lg"
                              value={maxPrice}
                              onChange={(e) => setMaxPrice(e.target.value)}
                            />
                          </InputGroup>
                        </HStack>
                      </VStack>
                    </GridItem>
                    
                    <GridItem>
                      <VStack align="start" spacing={4}>
                        <Badge colorScheme="yellow" fontSize="sm" px={2} py={1} borderRadius="md">
                          الترتيب
                        </Badge>
                        <Select
                          placeholder="ترتيب حسب"
                          icon={<ArrowUpDown size={16} />}
                          size="lg"
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                        >
                          <option value="newest">الأحدث</option>
                          <option value="oldest">الأقدم</option>
                          <option value="price_low">السعر: من الأقل إلى الأعلى</option>
                          <option value="price_high">السعر: من الأعلى إلى الأقل</option>
                          <option value="space_low">المساحة: من الأصغر إلى الأكبر</option>
                          <option value="space_high">المساحة: من الأكبر إلى الأصغر</option>
                        </Select>
                      </VStack>
                    </GridItem>
                  </Grid>
                  
                  <Button
                    colorScheme="yellow"
                    size="lg"
                    w="full"
                    mt={6}
                    leftIcon={<Search size={20} />}
                    onClick={handleSearch}
                  >
                    بحث عن العقارات
                  </Button>
                </Box>
              </Collapse>
            </Box>
          </MotionBox>
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero; 