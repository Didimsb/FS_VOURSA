import React, { useState } from 'react';
import {
  Box,
  Image,
  IconButton,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Flex,
  VStack,
} from '@chakra-ui/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MotionBox = motion(Box);

const PropertyMediaSlider = ({ media = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const nextSlide = () => {
    if (media.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  const prevSlide = () => {
    if (media.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + media.length) % media.length);
  };

  const currentMedia = media[currentIndex] || { type: 'image', url: '/bankily.png' };

  if (media.length === 0) {
    return (
      <Box position="relative" h="300px">
        <Image
          src="/bankily.png"
          alt="Default property image"
          w="full"
          h="full"
          objectFit="cover"
          borderRadius="lg"
        />
      </Box>
    );
  }

  return (
    <Box position="relative">
      <Box
        onClick={onOpen}
        cursor="pointer"
        position="relative"
        borderRadius="lg"
        overflow="hidden"
        h="300px"
      >
        <AnimatePresence mode="wait">
          <MotionBox
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
          >
            {currentMedia.type === 'image' ? (
              <Image
                src={currentMedia.url}
                alt="Property media"
                w="full"
                h="full"
                objectFit="cover"
              />
            ) : (
              <video
                src={currentMedia.url}
                controls
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}
          </MotionBox>
        </AnimatePresence>

        <HStack
          position="absolute"
          bottom={4}
          left={4}
          right={4}
          justify="space-between"
          zIndex={1}
        >
          <IconButton
            icon={<ChevronLeft />}
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            variant="solid"
            colorScheme="whiteAlpha"
          />
          <IconButton
            icon={<ChevronRight />}
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            variant="solid"
            colorScheme="whiteAlpha"
          />
        </HStack>

        {/* Thumbnails */}
        <Flex
          position="absolute"
          bottom={0}
          left={0}
          right={0}
          p={2}
          bg="blackAlpha.500"
          justify="center"
          gap={2}
        >
          {media.map((_, index) => (
            <Box
              key={index}
              w="8px"
              h="8px"
              borderRadius="full"
              bg={index === currentIndex ? "white" : "whiteAlpha.500"}
              cursor="pointer"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentIndex(index);
              }}
            />
          ))}
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="full">
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            alignItems="center"
            justifyContent="center"
            p={0}
          >
            <VStack spacing={4} w="full" h="full">
              <AnimatePresence mode="wait">
                <MotionBox
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  w="full"
                  h="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {currentMedia.type === 'image' ? (
                    <Image
                      src={currentMedia.url}
                      alt="Property media"
                      maxH="90vh"
                      objectFit="contain"
                    />
                  ) : (
                    <video
                      src={currentMedia.url}
                      controls
                      style={{ maxHeight: '90vh', width: 'auto' }}
                    />
                  )}
                </MotionBox>
              </AnimatePresence>

              <HStack
                position="absolute"
                bottom={4}
                left={4}
                right={4}
                justify="space-between"
                zIndex={1}
              >
                <IconButton
                  icon={<ChevronLeft />}
                  onClick={prevSlide}
                  variant="solid"
                  colorScheme="whiteAlpha"
                />
                <IconButton
                  icon={<ChevronRight />}
                  onClick={nextSlide}
                  variant="solid"
                  colorScheme="whiteAlpha"
                />
              </HStack>

              {/* Thumbnails */}
              <Flex
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                p={2}
                bg="blackAlpha.500"
                justify="center"
                gap={2}
              >
                {media.map((_, index) => (
                  <Box
                    key={index}
                    w="8px"
                    h="8px"
                    borderRadius="full"
                    bg={index === currentIndex ? "white" : "whiteAlpha.500"}
                    cursor="pointer"
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </Flex>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default PropertyMediaSlider; 