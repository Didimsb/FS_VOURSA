import React from 'react';
import { IconButton, useColorMode } from '@chakra-ui/react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionIconButton = motion(IconButton);

const ThemeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === 'dark';

  return (
    <MotionIconButton
      aria-label="Toggle theme"
      icon={isDark ? <Sun size={20} /> : <Moon size={20} />}
      onClick={toggleColorMode}
      variant="ghost"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      colorScheme={isDark ? 'yellow' : 'purple'}
    />
  );
};

export default ThemeToggle; 