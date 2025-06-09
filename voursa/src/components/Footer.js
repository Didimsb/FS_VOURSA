import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  useColorModeValue,
  Button,
  Icon,
} from '@chakra-ui/react';
import { MessageCircle } from 'lucide-react';
import { getSettings } from '../services/SettingsService';

const Footer = () => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      const response = await getSettings();
      if (response.success) {
        setSettings(response.settings);
      }
    };
    fetchSettings();
  }, []);

  return (
    <Box
      bg={bgColor}
      color={textColor}
      borderTop="1px"
      borderColor={borderColor}
      py={10}
    >
      <Container maxW="container.xl">
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
          <Stack spacing={6}>
            <Text fontSize="lg" fontWeight="bold">
            وكالة فرصة العقارية            </Text>
            <Text>
              وكالة عقارية متخصصة في بيع وشراء العقارات في موريتانيا. نقدم أفضل الخدمات العقارية لعملائنا الكرام.
            </Text>
            
          </Stack>

          <Stack spacing={6}>
            <Text fontSize="lg" fontWeight="bold">
              روابط سريعة
            </Text>
            <Stack spacing={4}>
              <Link href="/">الرئيسية</Link>
              <Link href="/about">من نحن</Link>
              <Link href="/contact"> اتصل بنا </Link>
              <Link href="/properties">العقارات</Link>
            </Stack>
          </Stack>

          <Stack spacing={6}>
            <Text fontSize="lg" fontWeight="bold">
              معلومات الاتصال
            </Text>
            <Stack spacing={4}>
              <Text>{settings?.contactPage?.address}</Text>
              <Text>البريد الإلكتروني: {settings?.contactPage?.email}</Text>
              <Text>الهاتف: {settings?.contactPage?.phone}</Text>
            </Stack>
          </Stack>
        </SimpleGrid>

        <Box
          borderTop="1px"
          borderColor={borderColor}
          mt={10}
          pt={6}
          textAlign="center"
        >
          <Text>
            © {new Date().getFullYear()} وكالة فرصة العقارية. جميع الحقوق محفوظة.
          </Text>
          <Text mt={2} fontSize="sm">
            تم التطوير بواسطة شركة الهلال الرقمية
          </Text>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 