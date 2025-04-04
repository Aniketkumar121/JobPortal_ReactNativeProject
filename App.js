// App.js
import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LogBox } from 'react-native';
import JobsStackNavigator from './navigation/JobsStackNavigator';
import BookmarksScreen from './screens/BookmarksScreen';
import { initDB } from './utils/db';
import { ThemeProvider, useTheme } from './utils/ThemeContext';

// Ignore specific warnings
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'SQLite is not supported on web'
]);

const Tab = createBottomTabNavigator();

// Custom theme configurations
const CustomLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f5f5f5',
    text: '#000',
    border: '#e0e0e0',
    card: '#fff',
    primary: '#007AFF',
  },
};

const CustomDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#000',
    text: '#fff',
    border: '#2c2c2e',
    card: '#1c1c1e',
    primary: '#0A84FF',
  },
};

function AppContent() {
  const { isDarkMode, colors } = useTheme();
  const theme = isDarkMode ? CustomDarkTheme : CustomLightTheme;

  useEffect(() => {
    initDB().catch(error => 
      console.error('Failed to initialize database:', error)
    );
  }, []);

  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Jobs') {
              iconName = focused ? 'briefcase' : 'briefcase-outline';
            } else if (route.name === 'Bookmarks') {
              iconName = focused ? 'bookmark' : 'bookmark-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: 'gray',
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '500',
          },
          tabBarStyle: {
            borderTopWidth: 1,
            borderTopColor: colors.border,
            paddingTop: 5,
            paddingBottom: 5,
            height: 60,
            backgroundColor: colors.card,
          },
          headerStyle: {
            backgroundColor: colors.card,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            color: colors.text,
          },
        })}
      >
        <Tab.Screen 
          name="Jobs" 
          component={JobsStackNavigator}
          options={{
            headerShown: false,
            title: 'Available Jobs',
          }}
        />
        <Tab.Screen 
          name="Bookmarks" 
          component={BookmarksScreen}
          options={{
            title: 'Saved Jobs',
            headerTitleAlign: 'center',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <AppContent />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}