import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Badge,
  Stack,
  Button,
  useColorModeValue,
  Image,
  SimpleGrid,
  Icon,
  Divider,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Spinner,
  Center,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import {
  Bed,
  Bath,
  Ruler,
  MapPin,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Building2,
  Home,
  LandPlot,
  Square,
  ArrowRight,
  Eye,
  Play,
} from 'lucide-react';
import { getProperty } from '../services/PropertyService';
import Footer from '../components/Footer';

const MotionBox = motion(Box);

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        const response = await getProperty(id);
        console.log('Property response:', response);
        if (response.success && response.property) {
          setProperty(response.property);
        } else {
          throw new Error('لم يتم العثور على بيانات العقار');
        }
      } catch (error) {
        console.error('Error fetching property:', error);
        toast({
          title: 'خطأ',
          description: error.message || 'حدث خطأ أثناء جلب بيانات العقار',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top'
        });
        setTimeout(() => {
          navigate('/properties');
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    } else {
      toast({
        title: 'خطأ',
        description: 'معرف العقار غير صالح',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top'
      });
      navigate('/properties');
    }
  }, [id, navigate, toast]);

  if (isLoading) {
    return <Center h="100vh"><Spinner size="xl" /></Center>;
  }

  if (!property) {
    return null;
  }
  
  return (
    <Box>
      <Container maxW="container.xl" py={8}>
        <Button
          leftIcon={<ArrowRight />}
          variant="ghost"
          mb={6}
          onClick={() => navigate(-1)}
        >
          العودة
        </Button>

        <Grid
          templateColumns={{ base: '1fr', md: '2fr 1fr' }}
          gap={8}
          bg={bgColor}
          borderRadius="xl"
          overflow="hidden"
          boxShadow="sm"
        >
          {/* Property Images */}
          <GridItem>
            <Box position="relative" borderRadius="lg" overflow="hidden">
              {property.images?.[activeImage]?.endsWith('.mp4') ? (
                <video
                  src={property.images[activeImage]}
                  controls
                  style={{ width: '100%', height: '500px', objectFit: 'cover' }}
                />
              ) : (
                <Image
                  src={property.images?.[activeImage] || '/placeholder.jpg'}
                  alt={property.title}
                  w="100%"
                  h="500px"
                  objectFit="cover"
                />
              )}
              {property.images?.length > 1 && (
                <SimpleGrid
                  columns={4}
                  spacing={2}
                  position="absolute"
                  bottom={4}
                  left={4}
                  right={4}
                >
                  {property.images.map((media, index) => (
                    <Box
                      key={index}
                cursor="pointer"
                      onClick={() => setActiveImage(index)}
                      borderWidth={activeImage === index ? 2 : 0}
                      borderColor="blue.500"
                borderRadius="md"
                overflow="hidden"
                position="relative"
              >
                      {media.endsWith('.mp4') ? (
                        <>
                <video
                            src={media}
                            style={{ width: '100%', height: '80px', objectFit: 'cover' }}
                />
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  bg="black"
                            opacity="0.7"
                  p={1}
                  borderRadius="full"
                >
                            <Icon as={Play} boxSize={4} color="white" />
                </Box>
                        </>
                      ) : (
                  <Image
                          src={media}
                    alt={`${property.title} - ${index + 1}`}
                    w="100%"
                    h="80px"
                    objectFit="cover"
                  />
                      )}
                </Box>
              ))}
            </SimpleGrid>
              )}
            </Box>
          </GridItem>

          {/* Property Details */}
          <GridItem p={6}>
            <Stack spacing={6}>
              <Box>
                <Badge colorScheme={property.status === 'للبيع' ? 'green' : 'red'} mb={2}>
                  {property.status}
                </Badge>
                <Heading size="lg" mb={2}>
                  {property.title}
                </Heading>
                <Text color="gray.500" fontSize="lg">
                  {property.province} - {property.district}
                </Text>
                <Text color="gray.500" fontSize="md">
                  {property.location}
                </Text>
              </Box>

                <Box>
                <Heading size="md" mb={2}>
                  السعر
                </Heading>
                <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                  {property.price?.toLocaleString('fr-FR')} أوقية
                  </Text>
                </Box>

              <SimpleGrid columns={2} spacing={4}>
                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <Icon as={Bed} boxSize={6} color="gray.500" />
                  <Text mt={2} fontSize="lg" fontWeight="medium">
                    {property.bedrooms || 0} غرف نوم
                  </Text>
                </Box>
                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <Icon as={Bath} boxSize={6} color="gray.500" />
                  <Text mt={2} fontSize="lg" fontWeight="medium">
                    {property.bathrooms || 0} حمامات
                  </Text>
                </Box>
                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <Icon as={Square} boxSize={6} color="gray.500" />
                  <Text mt={2} fontSize="lg" fontWeight="medium">
                    {property.area || 0} متر مربع
                  </Text>
                </Box>
                <Box p={4} borderWidth="1px" borderRadius="lg">
                  <Icon as={Eye} boxSize={6} color="gray.500" />
                  <Text mt={2} fontSize="lg" fontWeight="medium">
                    {property.views || 0} مشاهدة
                  </Text>
                </Box>
              </SimpleGrid>

              <Box>
                <Heading size="md" mb={4}>
                  الوصف
                </Heading>
                <Text color="gray.600" lineHeight="tall">
                  {property.description}
                </Text>
              </Box>

              {/* Seller Information */}
              {property.createdBy && (
                <Box>
                  <Heading size="md" mb={4}>
                    معلومات البائع
                  </Heading>
                  <VStack align="start" spacing={2}>
                    <Text>
                      <strong>الاسم:</strong> {property.createdBy.name}
                    </Text>
                    <Text>
                      <strong>البريد الإلكتروني:</strong> {property.createdBy.email}
                    </Text>
                    {property.createdBy.phone && (
                      <Text>
                        <strong>رقم الهاتف:</strong> {property.createdBy.phone}
                      </Text>
                    )}
                    {property.createdBy.whatsapp && (
                      <Text>
                        <strong>رقم الواتساب:</strong> {property.createdBy.whatsapp}
                      </Text>
                    )}
                  </VStack>

                  {/* Contact Buttons */}
                  <Stack direction="row" spacing={4} mt={4}>
                    {property.createdBy.phone && (
                      <Button
                        as="a"
                        href={`tel:${property.createdBy.phone}`}
                        leftIcon={<Phone />}
                        colorScheme="blue"
                        flex={1}
                      >
                        اتصل بالبائع
                      </Button>
                    )}
                    {property.createdBy.whatsapp && (
                      <Button
                        as="a"
                        href={`https://wa.me/${property.createdBy.whatsapp}`}
                        target="_blank"
                        leftIcon={<MessageCircle />}
                        colorScheme="whatsapp"
                        flex={1}
                      >
                        تواصل عبر واتساب
                      </Button>
                    )}
                  </Stack>
                </Box>
              )}

              {/* Property Features */}
              {property.features && property.features.length > 0 && (
              <Box>
                <Heading size="md" mb={4}>
                    مميزات العقار
                </Heading>
                <SimpleGrid columns={2} spacing={4}>
                  {property.features.map((feature, index) => (
                    <Box
                      key={index}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      display="flex"
                      alignItems="center"
                    >
                      <Icon as={Home} boxSize={4} color="green.500" mr={2} />
                      <Text>{feature}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
              )}

              {/* Property Amenities */}
              {property.amenities && property.amenities.length > 0 && (
              <Box>
                <Heading size="md" mb={4}>
                    المرافق
                </Heading>
                  <SimpleGrid columns={2} spacing={4}>
                    {property.amenities.map((amenity, index) => (
                      <Box
                        key={index}
                        p={3}
                        borderWidth="1px"
                        borderRadius="md"
                        display="flex"
                        alignItems="center"
                      >
                        <Icon as={Building2} boxSize={4} color="blue.500" mr={2} />
                        <Text>{amenity}</Text>
                      </Box>
                    ))}
                  </SimpleGrid>
              </Box>
              )}
            </Stack>
          </GridItem>
        </Grid>

        {/* Inquiry Modal */}
        <Modal isOpen={isInquiryModalOpen} onClose={() => setIsInquiryModalOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>تواصل مع البائع</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>الاسم</FormLabel>
                  <Input
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <Input
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <Input
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>الرسالة</FormLabel>
                  <Textarea
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" mr={3}>
                إرسال
              </Button>
              <Button variant="ghost" onClick={() => setIsInquiryModalOpen(false)}>
                إلغاء
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Footer />
      </Container>
    </Box>
  );
};

export default PropertyDetail; 