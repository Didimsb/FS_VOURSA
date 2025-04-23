import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorMode } from '@chakra-ui/react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const [isDark, setIsDark] = useState(colorMode === 'dark');

  // Sync with Chakra UI color mode
  useEffect(() => {
    setIsDark(colorMode === 'dark');
  }, [colorMode]);

  // Toggle theme function
  const toggleTheme = () => {
    toggleColorMode();
  };

  // Set theme function
  const setTheme = (theme) => {
    if (theme === 'dark' && colorMode !== 'dark') {
      toggleColorMode();
    } else if (theme === 'light' && colorMode !== 'light') {
      toggleColorMode();
    }
  };

  const value = {
    isDark,
    toggleTheme,
    setTheme
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export default ThemeContext; 