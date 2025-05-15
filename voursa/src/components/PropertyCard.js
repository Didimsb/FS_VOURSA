import React from 'react';
import {
  Box,
  Image,
  Badge,
  Text,
  Stack,
  Heading,
  useColorModeValue,
  Button,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { Bed, Bath, Square, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MotionBox = motion(Box);

const PropertyCard = ({ property }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const navigate = useNavigate();

  return (
    <MotionBox
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      bg={bgColor}
      rounded="xl"
      overflow="hidden"
      boxShadow="lg"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <Box position="relative">
        <Image
          src={property.images?.[0] || 'https://via.placeholder.com/300x200'}
          alt={property.title}
          w="full"
          h="200px"
          objectFit="cover"
        />
        <Box position="absolute" top={4} right={4} zIndex={1}>
          <Badge
            colorScheme={property.status === 'للبيع' ? 'green' : 'red'}
            px={2}
            py={1}
            borderRadius="md"
          >
            {property.status === 'للبيع' ? 'للبيع' : 'تم البيع'}
          </Badge>
        </Box>
      </Box>

      <Stack p={4} spacing={3}>
        <Heading size="md" noOfLines={1}>
          {property.title}
        </Heading>
        
        <Text color={useColorModeValue('gray.600', 'gray.300')} noOfLines={2}>
          {property.location}
        </Text>

        <Stack direction="row" spacing={4} align="center">
          <Stack direction="row" align="center" spacing={1}>
            <Bed size={16} />
            <Text>{property.bedrooms}</Text>
          </Stack>
          <Stack direction="row" align="center" spacing={1}>
            <Bath size={16} />
            <Text>{property.bathrooms}</Text>
          </Stack>
          <Stack direction="row" align="center" spacing={1}>
            <Square size={16} />
            <Text>{property.area}م²</Text>
          </Stack>
        </Stack>

        <Text
          fontSize="xl"
          fontWeight="bold"
          color={useColorModeValue('primary.600', 'primary.200')}
        >
          {property.price?.toLocaleString('fr-FR')} أوقية
        </Text>

        <Button
          leftIcon={<Eye size={16} />}
          colorScheme="primary"
          variant="outline"
          w="full"
          onClick={() => navigate(`/property/${property.id}`)}
        >
          عرض المزيد
        </Button>
      </Stack>
    </MotionBox>
  );
};

export default PropertyCard; 