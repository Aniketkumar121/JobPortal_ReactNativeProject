// utils/styles.js
import { Platform } from 'react-native';

export const getShadowStyle = () => {
  if (Platform.OS === 'web') {
    return {
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)'
    };
  }
  return {
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  };
};