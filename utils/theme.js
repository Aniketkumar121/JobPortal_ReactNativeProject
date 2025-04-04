// utils/theme.js
import { useColorScheme } from 'react-native';

export const useTheme = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return {
    isDarkMode,
    colors: {
      background: isDarkMode ? '#000' : '#fff',
      card: isDarkMode ? '#1c1c1e' : '#fff',
      text: isDarkMode ? '#fff' : '#000',
      secondaryText: isDarkMode ? '#a8a8a8' : '#666',
      border: isDarkMode ? '#2c2c2e' : '#eee',
      primary: '#007AFF',
      success: '#34C759',
    }
  };
};