import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  GridItem,
  Heading,
  Text,
  Stack,
  Button,
  Image,
  SimpleGrid,
  Icon,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
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
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Phone,
  MessageCircle,
  Square,
  ArrowRight,
  Eye,
  Play,
  Home,
  Building2,
  Calendar,
  Hash,
} from 'lucide-react';
import { getProperty } from '../services/PropertyService';
import Footer from '../components/Footer';

/* ── Theme constants ─────────────────────────────── */
const NAVY  = '#0A1628';
const GOLD  = '#C9A84C';
const IVORY = '#F8F4ED';
const SAND  = '#E8DCC8';

const MotionBox = motion(Box);
const MotionDiv = motion.div;

/* ── Status helpers ──────────────────────────────── */
const getStatusText = (status) => {
  const map = { للبيع: 'للبيع', بيع: 'تم البيع', للايجار: 'للإيجار', مؤجر: 'تم التأجير' };
  return map[status] || status;
};

/* ── Price counter hook ──────────────────────────── */
function usePriceCounter(target, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setValue(target);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

/* ─────────────────────────────────────────────────────
   MAIN COMPONENT
   ───────────────────────────────────────────────────── */
const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [property, setProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [isInquiryModalOpen, setIsInquiryModalOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });

  /* Price counter */
  const displayPrice = usePriceCounter(property?.price || 0);

  /* ── Fetch property ── */
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setIsLoading(true);
        const response = await getProperty(id);
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
          position: 'top',
        });
        setTimeout(() => navigate('/properties'), 2000);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProperty();
    } else {
      toast({ title: 'خطأ', description: 'معرف العقار غير صالح', status: 'error', duration: 3000, isClosable: true, position: 'top' });
      navigate('/properties');
    }
  }, [id, navigate, toast]);

  /* ── Loading state ── */
  if (isLoading) {
    return (
      <Center h="100vh" bg={IVORY}>
        <VStack spacing={4}>
          <Spinner size="xl" color={GOLD} thickness="4px" speed="0.65s" />
          <Text fontFamily="'Cairo', sans-serif" color={NAVY} fontWeight="600">جاري التحميل...</Text>
        </VStack>
      </Center>
    );
  }

  if (!property) return null;

  const images = property.images || [];
  const currentMedia = images[activeImage];
  const isVideo = currentMedia?.endsWith('.mp4');
  const phone = property.createdBy?.phone;
  const whatsapp = property.createdBy?.whatsapp;

  return (
    <Box bg={IVORY} minH="100vh" dir="rtl" fontFamily="'Cairo', 'Tajawal', sans-serif">
      <Container maxW="container.xl" py={{ base: 6, md: 10 }} px={{ base: 3, md: 6, lg: 8 }}>

        {/* ── Back Button ── */}
        <MotionDiv initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            mb={8}
            leftIcon={<ArrowRight size={18} />}
            fontFamily="'Cairo', sans-serif"
            fontWeight="700"
            color={NAVY}
            border={`1.5px solid ${GOLD}`}
            borderRadius="50px"
            px={6}
            _hover={{ bg: GOLD, color: NAVY }}
            transition="all 0.25s"
          >
            العودة
          </Button>
        </MotionDiv>

        {/* ══════════════════════════════════════════
            TWO COLUMN LAYOUT
           ══════════════════════════════════════════ */}
        <Grid templateColumns={{ base: '1fr', lg: '3fr 2fr' }} gap={8} alignItems="flex-start">

          {/* ─── LEFT: Media Gallery ─── */}
          <GridItem>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Main Image / Video */}
              <Box
                position="relative"
                borderRadius="20px"
                overflow="hidden"
                h={{ base: '280px', md: '520px' }}
                bg={SAND}
                cursor="zoom-in"
                _hover={{ '& img, & video': { transform: 'scale(1.02)' } }}
              >
                <AnimatePresence mode="wait">
                  <MotionDiv
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ width: '100%', height: '100%' }}
                  >
                    {isVideo ? (
                      <video
                        src={currentMedia}
                        controls
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      />
                    ) : (
                      <img
                        src={currentMedia || '/maison.jpg'}
                        alt={property.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', display: 'block' }}
                      />
                    )}
                  </MotionDiv>
                </AnimatePresence>

                {/* Image counter badge */}
                {images.length > 1 && (
                  <Box
                    position="absolute"
                    bottom="16px"
                    left="16px"
                    bg={NAVY}
                    color={GOLD}
                    px={3} py={1}
                    borderRadius="50px"
                    fontSize="0.8rem"
                    fontWeight="700"
                    fontFamily="'Cairo', sans-serif"
                  >
                    {activeImage + 1} / {images.length}
                  </Box>
                )}
              </Box>

              {/* Thumbnail Strip */}
              {images.length > 1 && (
                <Box
                  mt={4}
                  display="flex"
                  gap="12px"
                  overflowX="auto"
                  pb={2}
                  sx={{
                    scrollSnapType: 'x mandatory',
                    '&::-webkit-scrollbar': { height: '4px' },
                    '&::-webkit-scrollbar-thumb': { background: GOLD, borderRadius: '4px' },
                  }}
                >
                  {images.map((media, idx) => {
                    const isThumbVideo = media.endsWith('.mp4');
                    const isActive = idx === activeImage;
                    return (
                      <Box
                        key={idx}
                        flexShrink={0}
                        w="90px"
                        h="70px"
                        borderRadius="12px"
                        overflow="hidden"
                        cursor="pointer"
                        border={isActive ? `2px solid ${GOLD}` : '2px solid transparent'}
                        transform={isActive ? 'scale(1.05)' : 'scale(1)'}
                        transition="all 0.25s ease"
                        opacity={isActive ? 1 : 0.65}
                        scrollSnapAlign="start"
                        onClick={() => setActiveImage(idx)}
                        position="relative"
                        _hover={{ opacity: 1, borderColor: GOLD }}
                      >
                        {isThumbVideo ? (
                          <>
                            <video src={media} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <Box position="absolute" inset={0} display="flex" alignItems="center" justifyContent="center" bg="blackAlpha.500">
                              <Play size={18} color="white" />
                            </Box>
                          </>
                        ) : (
                          <img src={media} alt={`thumb-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        )}
                      </Box>
                    );
                  })}
                </Box>
              )}
            </MotionBox>
          </GridItem>

          {/* ─── RIGHT: Info Panel ─── */}
          <GridItem>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              position={{ lg: 'sticky' }}
              top={{ lg: '100px' }}
              bg="white"
              borderRadius="20px"
              boxShadow="0 20px 60px rgba(10,22,40,0.08)"
              p={{ base: '20px', md: '32px' }}
              border={`1px solid ${SAND}`}
            >
              {/* Status Badge */}
              <Box
                display="inline-block"
                bg={`linear-gradient(45deg, ${GOLD}, #e6c875)`}
                color={NAVY}
                px={4} py="6px"
                borderRadius="50px"
                fontSize="0.85rem"
                fontWeight="700"
                mb={3}
              >
                {getStatusText(property.status)}
              </Box>

              {/* Reference */}
              {property.reference && (
                <HStack spacing={2} mb={2} color="#999">
                  <Hash size={13} />
                  <Text fontSize="13px" fontWeight="600">رقم : {property.reference}</Text>
                </HStack>
              )}

              {/* Title */}
              <Heading
                as="h1"
                fontSize={{ base: '22px', md: '26px' }}
                fontWeight="800"
                color={NAVY}
                fontFamily="'Cairo', sans-serif"
                lineHeight="1.3"
                mb={3}
              >
                {property.title}
              </Heading>

              {/* Location */}
              {(property.province || property.district) && (
                <HStack spacing={2} mb={2} color="#666">
                  <MapPin size={16} color={GOLD} />
                  <Text fontSize="0.95rem" fontWeight="600">
                    {[property.province, property.district].filter(Boolean).join(' - ')}
                  </Text>
                </HStack>
              )}

              {/* Publish Date */}
              {property.createdAt && (
                <HStack spacing={2} mb={4} color="#aaa">
                  <Calendar size={14} />
                  <Text fontSize="0.82rem" fontWeight="500">
                    تاريخ النشر: {new Date(property.createdAt).toLocaleDateString('fr-FR')}
                  </Text>
                </HStack>
              )}

              {/* Gold Divider */}
              <Box h="2px" w="40%" bg={`linear-gradient(to left, ${GOLD}, transparent)`} mb={5} />

              {/* Price */}
              <Box mb={5}>
                <Text fontSize="11px" fontWeight="700" color={GOLD} textTransform="uppercase" letterSpacing="1.5px" mb={1}>
                  السعر
                </Text>
                <HStack spacing={2} alignItems="baseline">
                  <Text
                    fontSize={{ base: '28px', md: '36px' }}
                    fontWeight="900"
                    color={GOLD}
                    fontFamily="'Cairo', sans-serif"
                    lineHeight="1"
                  >
                    {displayPrice.toLocaleString('fr-FR')}
                  </Text>
                  <Text fontSize="18px" fontWeight="600" color={NAVY}>أوقية</Text>
                </HStack>
              </Box>

              {/* Stats Grid */}
              <SimpleGrid columns={2} spacing={3} mb={5}>
                <Box bg={IVORY} borderRadius="12px" p="16px">
                  <HStack spacing={2} mb={1}>
                    <Square size={16} color={GOLD} />
                    <Text fontSize="11px" fontWeight="700" color="#888" textTransform="uppercase">المساحة</Text>
                  </HStack>
                  <Text fontSize="1.1rem" fontWeight="800" color={NAVY}>
                    {property.area || 0} <Text as="span" fontWeight="400" fontSize="0.85rem">م²</Text>
                  </Text>
                </Box>
                <Box bg={IVORY} borderRadius="12px" p="16px">
                  <HStack spacing={2} mb={1}>
                    <Eye size={16} color={GOLD} />
                    <Text fontSize="11px" fontWeight="700" color="#888" textTransform="uppercase">المشاهدات</Text>
                  </HStack>
                  <Text fontSize="1.1rem" fontWeight="800" color={NAVY}>
                    {property.views || 0} <Text as="span" fontWeight="400" fontSize="0.85rem">مشاهدة</Text>
                  </Text>
                </Box>
              </SimpleGrid>

              <Box h="1px" bg={`linear-gradient(to right, transparent, ${SAND}, transparent)`} mb={5} />

              {/* Seller Info */}
              {property.createdBy && (
                <Box mb={5}>
                  <HStack spacing={2} mb={3}>
                    <Box w="3px" h="18px" bg={GOLD} borderRadius="2px" />
                    <Text fontSize="0.9rem" fontWeight="800" color={NAVY}>معلومات التواصل</Text>
                  </HStack>
                  <VStack align="stretch" spacing={2}>
                    {property.createdBy.name && (
                      <HStack spacing={3} color="#555">
                        <Text fontSize="0.88rem" fontWeight="600">👤 {property.createdBy.name}</Text>
                      </HStack>
                    )}
                    {phone && (
                      <HStack spacing={3} color="#555">
                        <Text fontSize="0.88rem" fontWeight="600">📞 {phone}</Text>
                      </HStack>
                    )}
                    {whatsapp && (
                      <HStack spacing={3} color="#555">
                        <Text fontSize="0.88rem" fontWeight="600">💬 {whatsapp}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>
              )}

              {/* CTA Buttons */}
              <Stack direction={{ base: 'row', md: 'column' }} spacing={3}>
                {phone && (
                  <Button
                    as="a"
                    href={`tel:${phone}`}
                    flex={{ base: 1, md: 'auto' }}
                    w={{ md: 'full' }}
                    h="52px"
                    borderRadius="14px"
                    fontFamily="'Cairo', sans-serif"
                    fontWeight="700"
                    fontSize={{ base: '0.85rem', md: '1rem' }}
                    bg={`linear-gradient(45deg, ${GOLD}, #e6c875)`}
                    color={NAVY}
                    border="none"
                    leftIcon={<Phone size={18} />}
                    _hover={{ transform: 'scale(1.02)', boxShadow: `0 8px 24px rgba(201,168,76,0.4)` }}
                    _active={{ transform: 'scale(0.98)' }}
                    transition="all 0.25s"
                    boxShadow={`0 4px 16px rgba(201,168,76,0.25)`}
                  >
                    اتصال بالبائع
                  </Button>
                )}
                {whatsapp && (
                  <Button
                    as="a"
                    href={`https://wa.me/${whatsapp}`}
                    target="_blank"
                    flex={{ base: 1, md: 'auto' }}
                    w={{ md: 'full' }}
                    h="52px"
                    borderRadius="14px"
                    fontFamily="'Cairo', sans-serif"
                    fontWeight="700"
                    fontSize={{ base: '0.85rem', md: '1rem' }}
                    bg={NAVY}
                    color="white"
                    border="none"
                    leftIcon={<MessageCircle size={18} />}
                    _hover={{ transform: 'scale(1.02)', boxShadow: `0 8px 24px rgba(10,22,40,0.3)`, bg: '#122040' }}
                    _active={{ transform: 'scale(0.98)' }}
                    transition="all 0.25s"
                  >
                    تواصل عبر واتساب
                  </Button>
                )}
              </Stack>
            </MotionBox>
          </GridItem>
        </Grid>

        {/* ══════════════════════════════════════════
            FULL-WIDTH SECTIONS BELOW
           ══════════════════════════════════════════ */}
        <VStack spacing={6} mt={10} align="stretch">

          {/* Description */}
          {property.description && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              bg={IVORY}
              borderRadius="16px"
              p={{ base: '20px', md: '32px' }}
              border={`1px solid ${SAND}`}
            >
              <Box mb={5} position="relative" display="inline-block">
                <Heading as="h2" fontSize="1.3rem" fontWeight="800" color={NAVY} fontFamily="'Cairo', sans-serif">
                  الوصف
                </Heading>
                <Box position="absolute" bottom="-6px" right={0} h="3px" w="60%" bg={`linear-gradient(to left, ${GOLD}, transparent)`} borderRadius="2px" />
              </Box>
              <Text
                color="#444"
                lineHeight="2"
                fontSize="1rem"
                fontFamily="'Cairo', sans-serif"
                mt={6}
              >
                {property.description}
              </Text>
            </MotionBox>
          )}

          {/* Features */}
          {property.features?.length > 0 && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              bg={IVORY}
              borderRadius="16px"
              p={{ base: '20px', md: '32px' }}
              border={`1px solid ${SAND}`}
            >
              <Box mb={5} position="relative" display="inline-block">
                <Heading as="h2" fontSize="1.3rem" fontWeight="800" color={NAVY} fontFamily="'Cairo', sans-serif">
                  مميزات العقار
                </Heading>
                <Box position="absolute" bottom="-6px" right={0} h="3px" w="60%" bg={`linear-gradient(to left, ${GOLD}, transparent)`} borderRadius="2px" />
              </Box>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mt={6}>
                {property.features.map((feature, idx) => (
                  <HStack
                    key={idx}
                    bg="white"
                    borderRadius="8px"
                    px="16px"
                    py="12px"
                    spacing={3}
                    borderRight={`3px solid ${GOLD}`}
                    boxShadow="0 2px 8px rgba(10,22,40,0.04)"
                  >
                    <Home size={16} color="#22c55e" />
                    <Text fontSize="0.92rem" fontWeight="600" color={NAVY}>{feature}</Text>
                  </HStack>
                ))}
              </SimpleGrid>
            </MotionBox>
          )}

          {/* Amenities */}
          {property.amenities?.length > 0 && (
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
              bg={IVORY}
              borderRadius="16px"
              p={{ base: '20px', md: '32px' }}
              border={`1px solid ${SAND}`}
            >
              <Box mb={5} position="relative" display="inline-block">
                <Heading as="h2" fontSize="1.3rem" fontWeight="800" color={NAVY} fontFamily="'Cairo', sans-serif">
                  المرافق
                </Heading>
                <Box position="absolute" bottom="-6px" right={0} h="3px" w="60%" bg={`linear-gradient(to left, ${GOLD}, transparent)`} borderRadius="2px" />
              </Box>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mt={6}>
                {property.amenities.map((amenity, idx) => (
                  <HStack
                    key={idx}
                    bg="white"
                    borderRadius="8px"
                    px="16px"
                    py="12px"
                    spacing={3}
                    borderRight={`3px solid #3b82f6`}
                    boxShadow="0 2px 8px rgba(10,22,40,0.04)"
                  >
                    <Building2 size={16} color="#3b82f6" />
                    <Text fontSize="0.92rem" fontWeight="600" color={NAVY}>{amenity}</Text>
                  </HStack>
                ))}
              </SimpleGrid>
            </MotionBox>
          )}
        </VStack>
      </Container>

      {/* ── Inquiry Modal ── */}
      <Modal isOpen={isInquiryModalOpen} onClose={() => setIsInquiryModalOpen(false)} isCentered>
        <ModalOverlay bg="rgba(10,22,40,0.6)" backdropFilter="blur(6px)" />
        <ModalContent
          bg={IVORY}
          borderRadius="20px"
          border={`1px solid ${SAND}`}
          fontFamily="'Cairo', sans-serif"
          dir="rtl"
          boxShadow="0 30px 80px rgba(10,22,40,0.2)"
        >
          <ModalHeader color={NAVY} fontWeight="800" borderBottom={`1px solid ${SAND}`} pb={4}>
            تواصل مع البائع
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <VStack spacing={4}>
              {[
                { label: 'الاسم', key: 'name', type: 'text' },
                { label: 'البريد الإلكتروني', key: 'email', type: 'email' },
                { label: 'رقم الهاتف', key: 'phone', type: 'tel' },
              ].map(({ label, key, type }) => (
                <FormControl key={key}>
                  <FormLabel color={NAVY} fontSize="0.9rem" fontWeight="700">{label}</FormLabel>
                  <Input
                    type={type}
                    value={inquiryForm[key]}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, [key]: e.target.value })}
                    borderRadius="10px"
                    borderColor={SAND}
                    bg="white"
                    _focus={{ borderColor: GOLD, boxShadow: `0 0 0 1px ${GOLD}` }}
                  />
                </FormControl>
              ))}
              <FormControl>
                <FormLabel color={NAVY} fontSize="0.9rem" fontWeight="700">الرسالة</FormLabel>
                <Textarea
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  borderRadius="10px"
                  borderColor={SAND}
                  bg="white"
                  rows={4}
                  _focus={{ borderColor: GOLD, boxShadow: `0 0 0 1px ${GOLD}` }}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter gap={3} borderTop={`1px solid ${SAND}`} pt={4}>
            <Button
              bg={`linear-gradient(45deg, ${GOLD}, #e6c875)`}
              color={NAVY}
              fontWeight="700"
              borderRadius="10px"
              px={6}
              _hover={{ transform: 'scale(1.02)', boxShadow: `0 4px 16px rgba(201,168,76,0.35)` }}
              fontFamily="'Cairo', sans-serif"
            >
              إرسال
            </Button>
            <Button
              variant="ghost"
              onClick={() => setIsInquiryModalOpen(false)}
              color="#888"
              fontFamily="'Cairo', sans-serif"
            >
              إلغاء
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Footer />
    </Box>
  );
};

export default PropertyDetail;