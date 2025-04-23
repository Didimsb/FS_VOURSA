import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, Flex } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '../context/SettingsContext';

const MotionBox = motion(Box);

const BannerSlider = () => {
  const { settings } = useSettings();
  const [currentBanner, setCurrentBanner] = useState(0);
  
  // Convert banner1, banner2, etc. to array
  const banners = settings?.banners?.home 
    ? Object.entries(settings.banners.home)
        .filter(([key]) => key.startsWith('banner'))
        .map(([_, value]) => value)
    : [];

  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [banners.length]);

  if (!banners.length) return null;

  return (
    <Box position="relative" h={{ base: '40vh', md: '50vh' }} overflow="hidden">
      <AnimatePresence mode="wait">
        <MotionBox
          key={currentBanner}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bgImage={`url('${banners[currentBanner].image}')`}
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
          <Container maxW="container.xl" h="full" position="relative" zIndex={1}>
            <Flex direction="column" justify="center" align="center" h="full" textAlign="center" color="white">
              <Heading
                as="h1"
                size="2xl"
                mb={4}
                textShadow="2px 2px 4px rgba(0,0,0,0.5)"
              >
                {banners[currentBanner].title}
              </Heading>
              <Text fontSize="xl" maxW="3xl" mx="auto" textShadow="1px 1px 2px rgba(0,0,0,0.5)">
                {banners[currentBanner].description}
              </Text>
            </Flex>
          </Container>
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
};

export default BannerSlider; 