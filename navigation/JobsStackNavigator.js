// navigation/JobsStackNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import JobsScreen from '../screens/JobsScreen';
import JobDetailScreen from '../screens/JobDetailScreen';
import { useTheme } from '../utils/ThemeContext';

const Stack = createStackNavigator();

// Theme Toggle Button Component
const ThemeToggleButton = () => {
  const { isDarkMode, toggleTheme, colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{
        marginRight: 15,
        padding: 8,
        borderRadius: 20,
      }}
    >
      <Ionicons
        name={isDarkMode ? 'sunny' : 'moon'}
        size={24}
        color={colors.text}
      />
    </TouchableOpacity>
  );
};

export default function JobsStackNavigator() {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 18,
          color: colors.text,
        },
        headerRight: () => <ThemeToggleButton />,
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerBackTitleVisible: false,
        headerBackImage: () => (
          <Ionicons
            name="chevron-back"
            size={24}
            color={colors.text}
            style={{ marginLeft: 15 }}
          />
        ),
      }}
    >
      <Stack.Screen 
        name="JobsList" 
        component={JobsScreen} 
        options={{
          title: 'Available Jobs',
          headerLeft: null,
        }}
      />
      <Stack.Screen 
        name="JobDetails" 
        component={JobDetailScreen} 
        options={({ navigation }) => ({
          title: 'Job Details',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ marginLeft: 10 }}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={colors.text}
                style={{ marginLeft: 5 }}
              />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}