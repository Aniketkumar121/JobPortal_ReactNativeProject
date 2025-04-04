// utils/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: {
      background: isDarkMode ? '#000' : '#f5f5f5',
      card: isDarkMode ? '#1c1c1e' : 'white',
      text: isDarkMode ? '#fff' : '#333',
      secondaryText: isDarkMode ? '#a8a8a8' : '#666',
      border: isDarkMode ? '#2c2c2e' : '#eee',
      searchBackground: isDarkMode ? '#2c2c2e' : '#f5f5f5',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);